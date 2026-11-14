"""TerraTwin — Scientific Scoring Engine (Python Implementation).

Reproducible implementation of the TerraTwin similarity and composite scoring contract.
Parity tested against the TypeScript browser module using shared fixtures.
"""
from __future__ import annotations

import argparse
import json
import math
from pathlib import Path
from typing import Any, Mapping

FEATURE_IDS = (
    "slope",
    "roughness",
    "temperature",
    "water_ice",
    "rock_mineral",
    "dryness",
    "vegetation",
    "dust_wind",
)

MINIMUM_WEIGHTED_COVERAGE = 0.75
WEIGHT_SUM_TOLERANCE = 1e-4

# Default target weight vectors (from scoring_policy.pending.json)
DEFAULT_WEIGHT_PROFILES = {
    "Moon": {
        "slope": 0.22,
        "roughness": 0.18,
        "temperature": 0.20,
        "water_ice": 0.20,
        "rock_mineral": 0.10,
        "dryness": 0.04,
        "vegetation": 0.03,
        "dust_wind": 0.03,
    },
    "Mars": {
        "slope": 0.12,
        "roughness": 0.10,
        "temperature": 0.10,
        "water_ice": 0.08,
        "rock_mineral": 0.22,
        "dryness": 0.18,
        "vegetation": 0.05,
        "dust_wind": 0.15,
    },
}

# Related geological lithology categories
DEFAULT_RELATED_ROCK_GROUPS = [
    ["basalt", "anorthosite", "gabbro", "volcanic_mafic"],
    ["sandstone", "siltstone", "mudstone", "sedimentary_clastic"],
    ["evaporite", "carbonate", "gypsum", "halite", "sedimentary_chemical"],
    ["granite", "rhyolite", "felsic_igneous"],
    ["impact_breccia", "regolith_breccia", "impactite"],
]


def validate_weights(
    weights: Mapping[str, float],
    tolerance: float = WEIGHT_SUM_TOLERANCE,
) -> None:
    """Validate weight vector: finite, non-negative, and summing to 1.0 within tolerance."""
    for feature_id, weight in weights.items():
        if not isinstance(weight, (int, float)):
            raise ValueError(f"Weight for '{feature_id}' must be numeric, got {type(weight).__name__}")
        if not math.isfinite(weight):
            raise ValueError(f"Weight for '{feature_id}' must be finite, got {weight}")
        if weight < 0.0:
            raise ValueError(f"Weight for '{feature_id}' must be non-negative, got {weight}")

    total_weight = sum(weights.values())
    if abs(total_weight - 1.0) > tolerance:
        raise ValueError(
            f"Weights must sum to 1.0 within tolerance {tolerance}; got sum {total_weight}"
        )


def compute_numeric_similarity(earth_val: float | None, target_val: float | None) -> float | None:
    """Compute numeric continuous similarity: 1 - |earth - target|, clamped to [0.0, 1.0]."""
    if earth_val is None or target_val is None:
        return None
    if not isinstance(earth_val, (int, float)) or not isinstance(target_val, (int, float)):
        raise ValueError("Continuous feature values must be numeric or null")
    if not math.isfinite(earth_val) or not math.isfinite(target_val):
        raise ValueError("Continuous feature values must be finite")
    if not (0.0 <= earth_val <= 1.0) or not (0.0 <= target_val <= 1.0):
        raise ValueError(f"Normalized values must be in [0.0, 1.0]; got earth={earth_val}, target={target_val}")

    sim = 1.0 - abs(float(earth_val) - float(target_val))
    return max(0.0, min(1.0, sim))


def compute_rock_similarity(
    earth_rock: str | None,
    target_rock: str | None,
    related_groups: list[list[str]] | None = None,
) -> float | None:
    """Compute categorical rock/mineral similarity based on approved category groups."""
    if earth_rock is None or target_rock is None:
        return None

    e = earth_rock.strip().casefold()
    t = target_rock.strip().casefold()
    if not e or not t:
        return None

    if e == t:
        return 1.0

    groups = related_groups or DEFAULT_RELATED_ROCK_GROUPS
    for group in groups:
        group_norm = [item.casefold() for item in group]
        if e in group_norm and t in group_norm:
            return 0.5

    return 0.0


def classify_strength_band(similarity: float | None) -> str:
    """Classify similarity into qualitative strength band."""
    if similarity is None:
        return "UNAVAILABLE"
    if similarity >= 0.75:
        return "STRONG"
    if similarity >= 0.40:
        return "PARTIAL"
    return "WEAK"


def calculate_site_score(
    earth_features: Mapping[str, Any],
    target_features: Mapping[str, Any],
    weights: Mapping[str, float],
    related_rock_groups: list[list[str]] | None = None,
    minimum_coverage: float = MINIMUM_WEIGHTED_COVERAGE,
) -> dict[str, Any]:
    """Calculate site-to-target similarity and composite score.

    Never coerces null to zero.
    Never silently renormalizes weights.
    Suppresses composite score if minimum coverage is not met.
    """
    validate_weights(weights)

    similarities: dict[str, float | None] = {}
    strength_bands: dict[str, str] = {}
    feature_contributions: dict[str, float | None] = {}
    weighted_coverage = 0.0
    weighted_sum = 0.0

    for feature_id, weight in weights.items():
        earth_val = earth_features.get(feature_id)
        target_val = target_features.get(feature_id)

        if feature_id == "rock_mineral":
            sim = compute_rock_similarity(earth_val, target_val, related_rock_groups)
        else:
            sim = compute_numeric_similarity(earth_val, target_val)

        similarities[feature_id] = sim
        strength_bands[feature_id] = classify_strength_band(sim)

        if sim is not None:
            weighted_coverage += weight
            contrib = weight * sim
            feature_contributions[feature_id] = round(contrib, 6)
            weighted_sum += contrib
        else:
            feature_contributions[feature_id] = None

    weighted_coverage = round(weighted_coverage, 4)
    has_sufficient_coverage = weighted_coverage >= minimum_coverage

    if has_sufficient_coverage:
        composite_score = round(weighted_sum * 100.0, 2)
        status = "COMPUTED"
        status_reason = None
    else:
        composite_score = None
        status = "INSUFFICIENT_COVERAGE"
        status_reason = (
            f"Weighted coverage ({weighted_coverage * 100:.1f}%) is below the "
            f"required threshold ({minimum_coverage * 100:.1f}%)."
        )

    return {
        "status": status,
        "status_reason": status_reason,
        "composite_score": composite_score,
        "weighted_coverage": weighted_coverage,
        "minimum_coverage": minimum_coverage,
        "similarities": similarities,
        "strength_bands": strength_bands,
        "contributions": feature_contributions,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="TerraTwin Scientific Scoring CLI")
    parser.add_argument("--fixture", type=str, help="Path to JSON test fixture file")
    args = parser.parse_args()

    if args.fixture:
        path = Path(args.fixture)
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)
        profiles = data["weight_profiles"]
        groups = data["rock_categories"]["related_groups"]
        min_cov = data.get("minimum_weighted_coverage", MINIMUM_WEIGHTED_COVERAGE)

        for case in data["test_cases"]:
            weights = profiles[case["target_body"]]
            result = calculate_site_score(
                case["earth_features"],
                case["target_features"],
                weights,
                related_rock_groups=groups,
                minimum_coverage=min_cov,
            )
            print(f"[{case['name']}] Status: {result['status']}, Score: {result['composite_score']}, Coverage: {result['weighted_coverage']}")
    else:
        print("TerraTwin Scoring Engine module. Use --fixture to evaluate a fixture file.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
