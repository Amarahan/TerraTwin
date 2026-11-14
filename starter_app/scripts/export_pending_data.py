"""Export a display-only pending-data contract; never extract or score locations."""
import csv
import hashlib
import json
from pathlib import Path

APP = Path(__file__).resolve().parents[1]
ROOT = APP.parent

def export():
    register_path = ROOT / 'data/interim/provisional_site_target_register.json'
    register = json.loads(register_path.read_text(encoding='utf-8'))
    plan = (ROOT / 'docs/TerraTwin_Final_Development_Plan.md').read_text(encoding='utf-8')
    section = plan.split('## 4. Scientific features')[1].split('## 5.')[0]
    labels = [line.split('. ', 1)[1] for line in section.splitlines() if line[:1].isdigit()]
    assert len(labels) == 8
    features = [dict(id=f'feature-{i+1}', label=label, unit=None, status='PENDING_REVIEW',
        definition_source='docs/TerraTwin_Final_Development_Plan.md, section 4',
        limitations='Final definition, dataset, unit, QA and cross-body comparability require team approval.') for i, label in enumerate(labels)]
    def record(row):
        # This release deliberately cannot publish newly approved data without a contract review.
        assert row['approved_coordinates'] is None
        assert row['coordinate_status'] == 'PENDING_HUMAN_REVIEW'
        return dict(id=row['id'], name=row['name'], body=row['body'], group=row.get('group'),
            region=row.get('region_candidate'), coordinates=None, coordinate_status=row['coordinate_status'],
            coordinate_issue=row['nature_of_conflict'], decision=row['human_decision_required'],
            score=None, measurements={f['id']: dict(value=None, unit=None, source_id=None, status='MISSING') for f in features})
    with (ROOT / 'data/manifests/dataset_inventory.csv').open(encoding='utf-8-sig', newline='') as f:
        sources=[dict(name=r['dataset_name'], body=r['planet_or_domain'], variables=r['variables_for_analog_atlas'],
            url=r['official_catalog_or_download_url'].strip(), notes=r['notes'], status='CANDIDATE_NOT_APPROVED',
            provenance='data/manifests/dataset_inventory.csv') for r in csv.DictReader(f)]
    data=dict(schema_version='pending-display-v1', register_status=register['register_status'],
        register_sha256=hashlib.sha256(register_path.read_bytes()).hexdigest(), register_sources=register['sources'],
        features=features, sites=[record(r) for r in register['sites']], targets=[record(r) for r in register['targets']],
        sources=sources, scoring_status='NOT_COMPUTED', policy='No approved scoring policy or validated measurements. No spatial extraction performed.',
        gaps=json.loads((ROOT/'data/interim/nonspatial_readiness.json').read_text(encoding='utf-8'))['data_gaps'])
    assert len(data['sites']) == 12 and len(data['targets']) == 4
    out=APP/'public/data/atlas.json'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print('Exported 12 provisional sites, 4 targets, 8 feature concepts; all measurements/coordinates/scores null.')

if __name__ == '__main__':
    export()
