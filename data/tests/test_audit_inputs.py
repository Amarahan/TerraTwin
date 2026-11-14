import unittest

from data.scripts.audit_inputs import _candidate, _coordinate_issue, _overall_status, build_asset_inventory, build_conflict_report, build_coverage_report, build_register, norm_name, validate_register


class CoordinateAuditTests(unittest.TestCase):
    def test_name_normalization_handles_punctuation_and_case(self):
        self.assertEqual(norm_name("Atacama (Yungay)"), "atacama yungay")

    def test_missing_and_disputed_coordinates_remain_pending(self):
        candidate_a = _candidate("-23.86", "-69.13", source_file="csv", row="Atacama")
        candidate_b = _candidate("-24.1", "-70", source_file="workbook", sheet="Site master", row="9")
        self.assertEqual(_overall_status([candidate_a, candidate_b]), "PENDING_HUMAN_REVIEW")
        issue = _coordinate_issue([candidate_a, candidate_b], {"target_name": "Atacama"}, None)
        self.assertIn("differ", issue)
        self.assertIsNone(candidate_a.get("approved_coordinates"))

    def test_no_csv_coordinates_is_reported_without_removing_record(self):
        candidate = _candidate(None, None, source_file="workbook", row="2", raw_text="18.4°N, 77.5°E")
        issue = _coordinate_issue([candidate], None, None)
        self.assertIn("No coordinate row", issue)
        self.assertEqual(candidate["status"], "PENDING_HUMAN_REVIEW")

    def test_supplied_register_preserves_all_planned_entries_without_approving_coordinates(self):
        register = build_register()
        self.assertEqual(len(register["sites"]), 12)
        self.assertEqual(len(register["targets"]), 4)
        self.assertEqual(
            {target["name"] for target in register["targets"]},
            {"Shackleton Crater Rim", "Malapert Massif", "Jezero Crater", "Meridiani Planum"},
        )
        conflict_report = build_conflict_report(register)
        self.assertEqual(conflict_report["summary"]["planned_earth_sites"], 12)
        self.assertEqual(conflict_report["summary"]["planned_planetary_targets"], 4)
        jezero = next(entry for entry in conflict_report["entries"] if entry["name"] == "Jezero Crater")
        self.assertEqual(len(jezero["csv_coordinates"]), 1)
        meridiani = next(entry for entry in conflict_report["entries"] if entry["name"] == "Meridiani Planum")
        self.assertEqual(meridiani["csv_coordinates"], [])
        twin_taung = next(entry for entry in conflict_report["entries"] if entry["name"] == "Twin Taung Maar Crater")
        source_coord = next(candidate for candidate in twin_taung["workbook_coordinates"] if candidate.get("sheet") == "Coordinate check — source coordinate")
        self.assertEqual((source_coord["latitude_raw"], source_coord["longitude_raw"]), ("22.37056", "95.01861"))
        self.assertIn("GVP Lower Chindwin", source_coord["coordinate_specific_source_reference"])
        for entry in register["sites"] + register["targets"]:
            self.assertIsNone(entry["approved_coordinates"])
            self.assertEqual(entry["coordinate_status"], "PENDING_HUMAN_REVIEW")

    def test_register_validator_rejects_dropped_sites_and_unapproved_coordinate_selection(self):
        register = build_register()
        register["sites"] = register["sites"][:-1]
        with self.assertRaisesRegex(ValueError, "complete planned 12-site scope"):
            validate_register(register)

        register = build_register()
        register["targets"][0]["approved_coordinates"] = {"latitude": -89.9, "longitude": 0}
        with self.assertRaisesRegex(ValueError, "Unapproved coordinates"):
            validate_register(register)

    def test_asset_inventory_keeps_unmanifested_hgt_as_a_source_gap(self):
        inventory = build_asset_inventory()
        self.assertEqual(len(inventory["items"]), 57)
        hgt = [item for item in inventory["items"] if item["path"].endswith(".hgt")]
        self.assertEqual(len(hgt), 2)
        self.assertTrue(all(item["source_reference_status"] == "NOT_RECORDED_IN_SUPPLIED_MANIFESTS" for item in hgt))
        self.assertTrue(all(item["format_size_check"]["matches_srtm1_layout_size"] for item in hgt))
        self.assertTrue(all("does not verify" in item["format_size_check"]["limitation"] for item in hgt))
        self.assertTrue(any(item["source_references"] for item in inventory["items"]))
        self.assertEqual(len(inventory["duplicate_content_groups"]), 2)

    def test_coverage_report_does_not_claim_scientific_coverage(self):
        report = build_coverage_report(build_register(), build_asset_inventory())
        self.assertEqual(report["scientific_feature_coverage"], "NOT_ASSESSED")
        self.assertEqual(report["pipeline_outputs"]["validated_site_measurements"], "NOT_COMPUTED")
        self.assertEqual(report["register"]["pending_human_coordinate_reviews"], 16)


if __name__ == "__main__":
    unittest.main()
