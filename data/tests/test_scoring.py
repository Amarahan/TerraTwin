"""Unit tests for the TerraTwin scientific scoring engine."""
from __future__ import annotations

import json
import math
from pathlib import Path
import unittest

from data.scripts.scoring import (
    calculate_site_score,
    compute_numeric_similarity,
    compute_rock_similarity,
    validate_weights,
    DEFAULT_WEIGHT_PROFILES,
    DEFAULT_RELATED_ROCK_GROUPS,
    MINIMUM_WEIGHTED_COVERAGE,
)

FIXTURE_PATH = Path(__file__).resolve().parent / "fixtures" / "scoring_fixtures.json"


class ScoringEngineTests(unittest.TestCase):
    def setUp(self) -> None:
        with FIXTURE_PATH.open("r", encoding="utf-8") as f:
            self.fixtures = json.load(f)

    def test_shared_fixtures_all_pass(self) -> None:
        profiles = self.fixtures["weight_profiles"]
        groups = self.fixtures["rock_categories"]["related_groups"]
        min_cov = self.fixtures.get("minimum_weighted_coverage", MINIMUM_WEIGHTED_COVERAGE)

        for case in self.fixtures["test_cases"]:
            with self.subTest(case=case["name"]):
                weights = profiles[case["target_body"]]
                result = calculate_site_score(
                    case["earth_features"],
                    case["target_features"],
                    weights,
                    related_rock_groups=groups,
                    minimum_coverage=min_cov,
                )

                self.assertEqual(result["status"], case["expected_status"])
                self.assertEqual(result["weighted_coverage"], case["expected_weighted_coverage"])

                if case["expected_score"] is None:
                    self.assertIsNone(result["composite_score"])
                else:
                    self.assertAlmostEqual(result["composite_score"], case["expected_score"], places=2)

                for feat_id, expected_sim in case["expected_similarities"].items():
                    actual_sim = result["similarities"][feat_id]
                    if expected_sim is None:
                        self.assertIsNone(actual_sim)
                    else:
                        self.assertAlmostEqual(actual_sim, expected_sim, places=4)

    def test_hand_calculated_moon_parity(self) -> None:
        """Explicit independent hand-calculated moon test verification."""
        weights = DEFAULT_WEIGHT_PROFILES["Moon"]
        earth = {
            "slope": 0.10,
            "roughness": 0.30,
            "temperature": 0.80,
            "water_ice": 0.00,
            "rock_mineral": "basalt",
            "dryness": 0.90,
            "vegetation": 0.00,
            "dust_wind": 0.40,
        }
        target = {
            "slope": 0.20,
            "roughness": 0.50,
            "temperature": 0.70,
            "water_ice": 0.00,
            "rock_mineral": "anorthosite",
            "dryness": 1.00,
            "vegetation": 0.00,
            "dust_wind": 0.10,
        }
        result = calculate_site_score(earth, target, weights)
        self.assertEqual(result["status"], "COMPUTED")
        self.assertEqual(result["composite_score"], 85.90)
        self.assertEqual(result["weighted_coverage"], 1.0)
        self.assertEqual(result["similarities"]["rock_mineral"], 0.5)

    def test_hand_calculated_mars_parity(self) -> None:
        """Explicit independent hand-calculated mars test verification."""
        weights = DEFAULT_WEIGHT_PROFILES["Mars"]
        earth = {
            "slope": 0.20,
            "roughness": 0.35,
            "temperature": 0.60,
            "water_ice": 0.10,
            "rock_mineral": "sandstone",
            "dryness": 0.80,
            "vegetation": 0.00,
            "dust_wind": 0.50,
        }
        target = {
            "slope": 0.10,
            "roughness": 0.25,
            "temperature": 0.40,
            "water_ice": 0.00,
            "rock_mineral": "siltstone",
            "dryness": 0.90,
            "vegetation": 0.00,
            "dust_wind": 0.30,
        }
        result = calculate_site_score(earth, target, weights)
        self.assertEqual(result["status"], "COMPUTED")
        self.assertEqual(result["composite_score"], 79.20)
        self.assertEqual(result["weighted_coverage"], 1.0)

    def test_null_value_is_never_zero(self) -> None:
        sim = compute_numeric_similarity(None, 0.5)
        self.assertIsNone(sim)

        sim_both_null = compute_numeric_similarity(None, None)
        self.assertIsNone(sim_both_null)

        rock_sim = compute_rock_similarity(None, "basalt")
        self.assertIsNone(rock_sim)

    def test_invalid_weights_rejected(self) -> None:
        # Sum != 1.0
        bad_weights = {"slope": 0.5, "roughness": 0.3}
        with self.assertRaises(ValueError):
            validate_weights(bad_weights)

        # Negative weight
        negative_weights = {"slope": 1.1, "roughness": -0.1}
        with self.assertRaises(ValueError):
            validate_weights(negative_weights)

        # Non-finite weight
        nan_weights = {"slope": math.nan, "roughness": 1.0}
        with self.assertRaises(ValueError):
            validate_weights(nan_weights)

    def test_out_of_bounds_inputs_rejected(self) -> None:
        with self.assertRaises(ValueError):
            compute_numeric_similarity(-0.1, 0.5)

        with self.assertRaises(ValueError):
            compute_numeric_similarity(1.1, 0.5)

        with self.assertRaises(ValueError):
            compute_numeric_similarity(math.nan, 0.5)

    def test_insufficient_coverage_suppresses_composite_score(self) -> None:
        weights = DEFAULT_WEIGHT_PROFILES["Moon"]
        # Only dust_wind and vegetation provided (total weight 0.06 < 0.75)
        earth = {"vegetation": 0.00, "dust_wind": 0.10}
        target = {"vegetation": 0.00, "dust_wind": 0.10}
        result = calculate_site_score(earth, target, weights, minimum_coverage=0.75)
        self.assertEqual(result["status"], "INSUFFICIENT_COVERAGE")
        self.assertIsNone(result["composite_score"])
        self.assertEqual(result["weighted_coverage"], 0.06)
        self.assertIn("below the required threshold", result["status_reason"])


if __name__ == "__main__":
    unittest.main()
