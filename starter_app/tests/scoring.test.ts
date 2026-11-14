import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  calculateSiteScore,
  computeNumericSimilarity,
  computeRockSimilarity,
  validateWeights,
  DEFAULT_WEIGHT_PROFILES,
} from '../src/scoring.ts';

const fixtures = JSON.parse(
  readFileSync(
    new URL('../../data/tests/fixtures/scoring_fixtures.json', import.meta.url),
    'utf8',
  ),
);

test('shared fixtures parity: all test cases match expected outputs', () => {
  const profiles = fixtures.weight_profiles;
  const groups = fixtures.rock_categories.related_groups;
  const minCov = fixtures.minimum_weighted_coverage;

  for (const tc of fixtures.test_cases) {
    const weights = profiles[tc.target_body];
    const result = calculateSiteScore(tc.earth_features, tc.target_features, weights, {
      relatedRockGroups: groups,
      minimumCoverage: minCov,
    });

    assert.equal(result.status, tc.expected_status, `Status mismatch in case ${tc.name}`);
    assert.equal(
      result.weightedCoverage,
      tc.expected_weighted_coverage,
      `Coverage mismatch in case ${tc.name}`,
    );

    if (tc.expected_score === null) {
      assert.equal(result.compositeScore, null, `Expected null score in case ${tc.name}`);
    } else {
      assert.ok(result.compositeScore !== null);
      assert.ok(
        Math.abs(result.compositeScore - tc.expected_score) < 0.01,
        `Score mismatch in case ${tc.name}: expected ${tc.expected_score}, got ${result.compositeScore}`,
      );
    }

    for (const [featId, expectedSim] of Object.entries(tc.expected_similarities)) {
      const actualSim = result.similarities[featId];
      if (expectedSim === null) {
        assert.equal(actualSim, null, `Similarity should be null for ${featId} in ${tc.name}`);
      } else {
        assert.ok(actualSim !== null);
        assert.ok(
          Math.abs((actualSim as number) - (expectedSim as number)) < 0.0001,
          `Similarity mismatch for ${featId} in ${tc.name}: expected ${expectedSim}, got ${actualSim}`,
        );
      }
    }
  }
});

test('hand-calculated Moon parity matches 85.90 exactly', () => {
  const weights = DEFAULT_WEIGHT_PROFILES.Moon;
  const earth = {
    slope: 0.1,
    roughness: 0.3,
    temperature: 0.8,
    water_ice: 0.0,
    rock_mineral: 'basalt',
    dryness: 0.9,
    vegetation: 0.0,
    dust_wind: 0.4,
  };
  const target = {
    slope: 0.2,
    roughness: 0.5,
    temperature: 0.7,
    water_ice: 0.0,
    rock_mineral: 'anorthosite',
    dryness: 1.0,
    vegetation: 0.0,
    dust_wind: 0.1,
  };

  const result = calculateSiteScore(earth, target, weights);
  assert.equal(result.status, 'COMPUTED');
  assert.equal(result.compositeScore, 85.9);
  assert.equal(result.weightedCoverage, 1.0);
  assert.equal(result.similarities.rock_mineral, 0.5);
});

test('hand-calculated Mars parity matches 79.20 exactly', () => {
  const weights = DEFAULT_WEIGHT_PROFILES.Mars;
  const earth = {
    slope: 0.2,
    roughness: 0.35,
    temperature: 0.6,
    water_ice: 0.1,
    rock_mineral: 'sandstone',
    dryness: 0.8,
    vegetation: 0.0,
    dust_wind: 0.5,
  };
  const target = {
    slope: 0.1,
    roughness: 0.25,
    temperature: 0.4,
    water_ice: 0.0,
    rock_mineral: 'siltstone',
    dryness: 0.9,
    vegetation: 0.0,
    dust_wind: 0.3,
  };

  const result = calculateSiteScore(earth, target, weights);
  assert.equal(result.status, 'COMPUTED');
  assert.equal(result.compositeScore, 79.2);
  assert.equal(result.weightedCoverage, 1.0);
  assert.equal(result.similarities.rock_mineral, 0.5);
});

test('null values are never coerced to zero', () => {
  assert.equal(computeNumericSimilarity(null, 0.5), null);
  assert.equal(computeNumericSimilarity(undefined, 0.5), null);
  assert.equal(computeNumericSimilarity(0.5, null), null);
  assert.equal(computeNumericSimilarity(null, null), null);
  assert.equal(computeRockSimilarity(null, 'basalt'), null);
});

test('invalid weights are rejected', () => {
  // Sum != 1.0
  assert.throws(() => validateWeights({ slope: 0.5, roughness: 0.3 }));

  // Negative weight
  assert.throws(() => validateWeights({ slope: 1.1, roughness: -0.1 }));

  // Non-finite weight
  assert.throws(() => validateWeights({ slope: Number.NaN, roughness: 1.0 }));
});

test('out-of-bounds normalized values are rejected', () => {
  assert.throws(() => computeNumericSimilarity(-0.1, 0.5));
  assert.throws(() => computeNumericSimilarity(1.1, 0.5));
  assert.throws(() => computeNumericSimilarity(Number.NaN, 0.5));
});

test('insufficient coverage suppresses composite score', () => {
  const weights = DEFAULT_WEIGHT_PROFILES.Moon;
  const earth = { vegetation: 0.0, dust_wind: 0.1 };
  const target = { vegetation: 0.0, dust_wind: 0.1 };

  const result = calculateSiteScore(earth, target, weights, { minimumCoverage: 0.75 });
  assert.equal(result.status, 'INSUFFICIENT_COVERAGE');
  assert.equal(result.compositeScore, null);
  assert.equal(result.weightedCoverage, 0.06);
  assert.ok(result.statusReason?.includes('below the required threshold'));
});
