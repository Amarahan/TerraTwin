import copy
import hashlib
import unittest

from data.scripts.ingest_workbook_candidates import (
    ROOT, WORKBOOKS, REGISTER, build, extract_earth, parse_number, serialize,
)
import json


class WorkbookIngestionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.outputs = build()
        cls.book = cls.outputs['workbook_cells.json']['workbooks'][0]
        cls.register = json.loads((ROOT / REGISTER).read_text(encoding='utf-8'))
        cls.source = {k: cls.book[k] for k in ('path', 'sha256')}

    def test_actual_cells_have_hash_and_exact_location(self):
        record = self.outputs['earth_candidates.json']['sites'][0]['variables']['slope_deg']
        cell = self.book['sheets']['Site data']['cells']['E5']
        self.assertEqual(record['source']['cell'], 'E5')
        self.assertEqual(record['original_cell'], cell)
        self.assertEqual(record['candidate_value'], float(cell['text']))
        self.assertEqual(record['source']['sha256'], hashlib.sha256((ROOT / WORKBOOKS[0]).read_bytes()).hexdigest())
        self.assertFalse(record['eligible_for_scoring'])

    def test_real_missing_ndvi_is_not_zero(self):
        sites = self.outputs['earth_candidates.json']['sites']
        mcmurdo = next(s for s in sites if s['id'] == 'mcmurdo-dry-valleys')
        self.assertIsNone(mcmurdo['variables']['ndvi']['candidate_value'])
        self.assertEqual(mcmurdo['variables']['ndvi']['status'], 'MISSING')
        self.assertEqual(parse_number({'cell_type': 'n', 'text': '0'}), 0)

    def test_scope_is_preserved_and_not_scoring_eligible(self):
        data = self.outputs['earth_candidates.json']
        self.assertEqual(len(data['sites']), 12)
        self.assertEqual(len(data['targets']), 4)
        self.assertFalse(data['eligible_for_scoring'])
        for record in data['sites'] + data['targets']:
            self.assertIsNone(record['approved_coordinates'])
            self.assertEqual(record['coordinate_status'], 'PENDING_HUMAN_REVIEW')

    def test_nan_infinity_and_non_numeric_types_are_rejected(self):
        for value in ('NaN', 'Infinity', '-Infinity', 'not measured'):
            with self.subTest(value=value), self.assertRaises(ValueError):
                parse_number({'cell_type': 'n', 'text': value})
        with self.assertRaises(ValueError):
            parse_number({'cell_type': 's', 'text': '0'})

    def test_changed_columns_are_rejected(self):
        sheets = copy.deepcopy(self.book['sheets'])
        sheets['Site data']['cells']['J4']['text'] = 'seasonal_range_K'
        with self.assertRaisesRegex(ValueError, 'Source column changed'):
            extract_earth(sheets, self.register, self.source)

    def test_duplicate_unknown_and_category_mismatch_are_rejected(self):
        for ref, value in [('A6', 'Twin Taung maar crater'), ('A6', 'Unknown site'), ('B6', 'Control')]:
            sheets = copy.deepcopy(self.book['sheets'])
            sheets['Site data']['cells'][ref]['text'] = value
            with self.subTest(ref=ref, value=value), self.assertRaises(ValueError):
                extract_earth(sheets, self.register, self.source)

    def test_formulas_preserved_as_cached_not_recomputed(self):
        cell = self.book['sheets']['Site data']['cells']['O5']
        self.assertEqual(cell['formula']['text'], 'IF(N5="","",N5-M5)')
        self.assertIsNotNone(cell['stored_value'])

    def test_output_is_deterministic_and_inputs_untouched(self):
        before = {p: hashlib.sha256((ROOT / p).read_bytes()).hexdigest() for p in (*WORKBOOKS, REGISTER)}
        again = build()
        self.assertEqual(serialize(again), serialize(self.outputs))
        after = {p: hashlib.sha256((ROOT / p).read_bytes()).hexdigest() for p in before}
        self.assertEqual(before, after)


if __name__ == '__main__':
    unittest.main()
