import unittest
from pathlib import Path

from data.scripts.audit_inputs import ROOT
from data.scripts.nonspatial_readiness import (
    SRTMGL1_BYTES,
    SRTMGL3_BYTES,
    build_readiness,
    inspect_hgt,
    reconcile_manifests,
)


class NonspatialReadinessTests(unittest.TestCase):
    def test_both_hgt_files_match_srtmgl1_size_not_srtmgl3_size(self):
        files = sorted((ROOT / "data/earth").glob("*.hgt"))
        self.assertEqual([path.name for path in files], ["N36W117.hgt", "S24W070.hgt"])
        for path in files:
            result = inspect_hgt(path)
            self.assertEqual(result["file_size_bytes"], SRTMGL1_BYTES)
            self.assertEqual(SRTMGL1_BYTES, 25_934_402)
            self.assertEqual(SRTMGL3_BYTES, 2_884_802)
            self.assertTrue(result["matches_srtmgl1_size"])
            self.assertFalse(result["matches_srtmgl3_size"])
            self.assertEqual(result["exact_product_version"], "UNVERIFIED")
            self.assertEqual(result["download_origin"], "UNVERIFIED")
            self.assertGreater(result["interpreted_sample_count"], 0)

    def test_manifest_reconciliation_does_not_rewrite_sources(self):
        before = {path: path.read_bytes() for path in (ROOT / "data/manifests").glob("*.csv")}
        reconciliation = reconcile_manifests()
        after = {path: path.read_bytes() for path in before}
        self.assertEqual(before, after)
        self.assertGreater(reconciliation["counts_by_status"].get("UNIQUE_BASENAME_PATH_MISMATCH", 0), 0)
        self.assertEqual(set(reconciliation["bundled_hgt_not_declared_by_local_file_manifest"]), {
            "data/earth/N36W117.hgt", "data/earth/S24W070.hgt"
        })

    def test_readiness_report_preserves_scope_and_defers_scientific_coverage(self):
        report = build_readiness()
        self.assertEqual(len(report["hgt_files"]), 2)
        self.assertEqual(len(report["scientific_feature_source_inventory"]), 24)
        self.assertFalse(report["local_srtm_guide"]["present"])
        self.assertEqual(report["processing_status"], "NO_SPATIAL_EXTRACTION_OR_SCORING_PERFORMED")


if __name__ == "__main__":
    unittest.main()
