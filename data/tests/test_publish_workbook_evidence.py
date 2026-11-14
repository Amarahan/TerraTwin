import copy
import hashlib
import json
import subprocess
import unittest
from data.scripts.publish_workbook_evidence import ROOT, build

class PublishedEvidenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle,cls.audit=build()
    def test_all_source_values_and_missing_cells_preserved(self):
        self.assertEqual(len(self.bundle['sites']),12)
        self.assertEqual(len(self.bundle['targets']),4)
        values=[v['value'] for s in self.bundle['sites'] for v in s['variables'].values()]
        self.assertEqual(sum(v is not None for v in values),116)
        self.assertEqual(values.count(None),4)
        self.assertFalse(self.bundle['eligible_for_scoring'])
    def test_source_hash_and_cell_trace_are_real(self):
        for site in self.bundle['sites']:
            for reading in site['variables'].values():
                source=reading['source']
                self.assertEqual(source['sha256'],hashlib.sha256((ROOT/source['path']).read_bytes()).hexdigest())
                if reading['value'] is not None:self.assertEqual(reading['value'],float(reading['original_text']))
    def test_legacy_missing_ndvi_substitution_is_explicit_conflict(self):
        conflicts=[r for r in self.audit['comparisons'] if r['status']=='CONFLICT']
        self.assertEqual(self.audit['match_count'],71)
        self.assertEqual(len(conflicts),1)
        self.assertEqual(conflicts[0]['site_id'],'mcmurdo-dry-valleys')
        self.assertIsNone(conflicts[0]['workbook_value'])
        self.assertEqual(conflicts[0]['legacy_value'],0)
        self.assertEqual(conflicts[0]['source']['cell'],'K11')
    def test_bad_legacy_scope_is_rejected(self):
        with self.assertRaisesRegex(ValueError,'record IDs'):
            build(legacy={'sites':{},'targets':{}})
    def test_generated_outputs_match_source_deterministically(self):
        self.assertEqual(self.bundle,json.loads((ROOT/'starter_app/public/data/workbook-evidence.json').read_text(encoding='utf-8')))
        self.assertEqual(self.bundle,json.loads((ROOT/'data/processed/workbook_evidence.json').read_text(encoding='utf-8')))
        self.assertEqual(self.audit,json.loads((ROOT/'data/processed/antigravity_reconciliation.json').read_text(encoding='utf-8')))
