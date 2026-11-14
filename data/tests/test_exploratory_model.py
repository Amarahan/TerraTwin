import json,unittest
from data.scripts.build_exploratory_model import build,normalize,ROOT
class ExploratoryModelTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.model=build()
 def test_all_48_model_comparisons_exist(self):
  self.assertEqual(len(self.model['sites']),12);self.assertEqual(len(self.model['targets']),4)
  self.assertEqual(sum(len(s) for s in self.model['python_scores'].values()),48)
  self.assertFalse(self.model['scientifically_validated'])
 def test_mcmurdo_ndvi_null_and_coverage_remains_partial(self):
  site=next(s for s in self.model['sites'] if s['id']=='mcmurdo-dry-valleys')
  self.assertIsNone(site['features']['vegetation']['raw']);self.assertIsNone(site['features']['vegetation']['normalized'])
  for target in self.model['targets']:
   score=self.model['python_scores'][target['id']][site['id']]
   self.assertEqual(score['evaluated_features'],7)
   self.assertEqual(score['weighted_coverage'],0.95 if target['body']=='Mars' else 0.97)
   self.assertIsNone(score['contributions']['vegetation'])
   self.assertAlmostEqual(score['composite_score'],100*sum(v or 0 for v in score['contributions'].values()),places=2)
 def test_normalization_preserves_missing_and_rejects_out_of_range(self):
  self.assertIsNone(normalize(None,{'operation':'identity'}))
  with self.assertRaises(ValueError):normalize(40,{'operation':'divide','divisor':30})
 def test_target_inputs_are_explicit_assumptions(self):
  self.assertTrue(all(f['status']=='MODEL_ASSUMPTION' for t in self.model['targets'] for f in t['features'].values()))
 def test_outputs_are_current(self):
  for path in ['data/processed/exploratory_model.json','starter_app/public/data/exploratory-model.json']:
   self.assertEqual(self.model,json.loads((ROOT/path).read_text(encoding='utf-8')))
