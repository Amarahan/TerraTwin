"""Publish losslessly parsed workbook evidence, and reconcile legacy module claims.

No normalization, scoring, spatial extraction or scientific approval occurs here.
Run: python data/scripts/publish_workbook_evidence.py [--check]
"""
from __future__ import annotations
import argparse
import hashlib
import json
import subprocess
from pathlib import Path
try:
    from .ingest_workbook_candidates import build as ingest, ROOT, serialize
except ImportError:
    from ingest_workbook_candidates import build as ingest, ROOT, serialize

# These are the legacy app's associations, NOT approved feature definitions.
LEGACY_ASSOCIATIONS = {
    'slope': 'slope_deg', 'roughness': 'roughness_m', 'temperature': 'lst_range_K',
    'dryness': 'rain_era5_mm', 'vegetation': 'ndvi', 'dust_wind': 'aod_055',
}
UNITS = {'slope_deg':'degrees', 'roughness_m':'m', 'elev_m':'m', 'lst_day_K':'K',
         'lst_night_K':'K', 'lst_range_K':'K', 'ndvi':'index', 'aod_055':'optical depth',
         'rain_era5_mm':'mm (period unverified)', 'rain_chirps_mm':'mm (period unverified)'}

def build(root: Path = ROOT, legacy: dict | None = None) -> tuple[dict,dict]:
    ingested = ingest(root)
    evidence = ingested['earth_candidates.json']
    master = ingested['workbook_cells.json']['workbooks'][0]
    if legacy is None:
        result=subprocess.run(['node','--experimental-strip-types',str(root/'data/scripts/snapshot_candidate_module.mjs')],cwd=root,capture_output=True,text=True,check=True,encoding='utf-8')
        legacy=json.loads(result.stdout)
    if set(legacy['sites']) != {s['id'] for s in evidence['sites']} or set(legacy['targets']) != {t['id'] for t in evidence['targets']}:
        raise ValueError('Legacy record IDs disagree with canonical 12-site/4-target scope')
    fields=[{'id':key,'label':key,'unit':value,'unit_status':'SOURCE_HEADER_INTERPRETATION'} for key,value in UNITS.items()]
    sites=[]; comparisons=[]
    for site in evidence['sites']:
        variables={}
        for key,cell in site['variables'].items():
            variables[key]={'value':cell['candidate_value'],'status':cell['status'],
                'source':cell['source'],'original_text':None if cell['original_cell'] is None else cell['original_cell']['text']}
        sites.append({'id':site['id'],'name':site['name'],'variables':variables})
        for feature,variable in LEGACY_ASSOCIATIONS.items():
            cell=site['variables'][variable];model=legacy['sites'][site['id']]['features'][feature]
            value=cell['candidate_value'];raw=model['raw']
            comparisons.append({'site_id':site['id'],'legacy_feature':feature,'workbook_variable':variable,
                'workbook_value':value,'legacy_value':raw,'status':'MATCH' if value==raw else 'CONFLICT',
                'source':cell['source'],'legacy_source_claim':model['sourceCitation'],
                'note':'Matching a number does not validate the legacy source citation or comparability.'})
    bundle={'schema_version':'workbook-evidence-v1','eligible_for_scoring':False,
        'register_sha256':evidence['register_sha256'],
        'source_statement':evidence['source_statement']['text'],
        'warnings':evidence['warnings']+['Raw workbook readings are not approved feature measurements. Unit labels follow source headers; annual rainfall aggregation is unverified.'],
        'fields':fields,'sites':sites,
        'targets':evidence['targets'],
        'legacy_feature_associations':LEGACY_ASSOCIATIONS,
        'association_status':'UNAPPROVED_LEGACY_ASSOCIATION'}
    module=root/'starter_app/src/candidateData.ts'
    audit={'schema_version':'legacy-reconciliation-v1','eligible_for_scoring':False,
        'legacy_module':module.relative_to(root).as_posix(),'legacy_sha256':hashlib.sha256(module.read_bytes()).hexdigest(),
        'comparisons':comparisons,'match_count':sum(c['status']=='MATCH' for c in comparisons),
        'conflict_count':sum(c['status']=='CONFLICT' for c in comparisons),
        'legacy_target_claims':legacy['targets'], 'legacy_model_choices':legacy['model'],
        'original_target_context':{'source':{'path':master['path'],'sha256':master['sha256'],'sheet':'Moon & Mars numbers'}, 'cells':master['sheets']['Moon & Mars numbers']['cells']},
        'approval_status':'PENDING_HUMAN_REVIEW',
        'unresolved':['Legacy target constants need exact quantitative source citations and matching geometry/time/scale.',
          'Normalization ranges/direction, related rock groups, ice encoding and missing-data policy are not approved.',
          'No approved coordinates or reference population exists; maps/sampling/ranks cannot be approved from these constants.',
          'Legacy citations are preserved as claims, not verified source attribution.']}
    return bundle,audit

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--check',action='store_true');args=parser.parse_args()
    bundle,audit=build()
    outputs={ROOT/'data/processed/workbook_evidence.json':bundle,
             ROOT/'starter_app/public/data/workbook-evidence.json':bundle,
             ROOT/'data/processed/antigravity_reconciliation.json':audit}
    for path,obj in outputs.items():
        content=serialize(obj)
        if args.check:
            if not path.exists() or path.read_text(encoding='utf-8')!=content:raise ValueError(f'Stale or missing output: {path}')
        else:
            path.parent.mkdir(parents=True,exist_ok=True)
            temporary=path.with_suffix('.json.tmp');temporary.write_text(content,encoding='utf-8');temporary.replace(path)
    count=sum(v['value'] is not None for s in bundle['sites'] for v in s['variables'].values())
    print(f'{"Verified" if args.check else "Published"} {count} workbook values; {120-count} missing cells; 12 sites and 4 targets retained.')
    print(f'Legacy numerical reconciliation: {audit["match_count"]} matches; {audit["conflict_count"]} conflicts. No site scores calculated.')
if __name__=='__main__':main()
