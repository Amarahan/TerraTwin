/**
 * TerraTwin — Scientific Scoring Engine (TypeScript Implementation)
 *
 * Browser-side implementation of the TerraTwin similarity and composite scoring contract.
 * Pure calculation module with zero side effects. Parity verified against Python implementation.
 */

export type StrengthBand = 'STRONG' | 'PARTIAL' | 'WEAK' | 'UNAVAILABLE';
export type ScoreStatus = 'COMPUTED' | 'INSUFFICIENT_COVERAGE';

export interface ScoreResult {
  status: ScoreStatus;
  statusReason: string | null;
  compositeScore: number | null;
  weightedCoverage: number;
  minimumCoverage: number;
  similarities: Record<string, number | null>;
  strengthBands: Record<string, StrengthBand>;
  contributions: Record<string, number | null>;
}

export const MINIMUM_WEIGHTED_COVERAGE = 0.75;
export const WEIGHT_SUM_TOLERANCE = 1e-4;

export const DEFAULT_WEIGHT_PROFILES: Record<string, Record<string, number>> = {
  Moon: {
    slope: 0.22,
    roughness: 0.18,
    temperature: 0.2,
    water_ice: 0.2,
    rock_mineral: 0.1,
    dryness: 0.04,
    vegetation: 0.03,
    dust_wind: 0.03,
  },
  Mars: {
    slope: 0.12,
    roughness: 0.1,
    temperature: 0.1,
    water_ice: 0.08,
    rock_mineral: 0.22,
    dryness: 0.18,
    vegetation: 0.05,
    dust_wind: 0.15,
  },
};

export const DEFAULT_RELATED_ROCK_GROUPS: string[][] = [
  ['basalt', 'anorthosite', 'gabbro', 'volcanic_mafic'],
  ['sandstone', 'siltstone', 'mudstone', 'sedimentary_clastic'],
  ['evaporite', 'carbonate', 'gypsum', 'halite', 'sedimentary_chemical'],
  ['granite', 'rhyolite', 'felsic_igneous'],
  ['impact_breccia', 'regolith_breccia', 'impactite'],
];

/**
 * Validates that weights are finite, non-negative, and sum to 1.0 within tolerance.
 */
export function validateWeights(
  weights: Record<string, number>,
  tolerance: number = WEIGHT_SUM_TOLERANCE,
): void {
  let total = 0;
  for (const [feat, w] of Object.entries(weights)) {
    if (typeof w !== 'number' || !Number.isFinite(w)) {
      throw new Error(`Weight for '${feat}' must be a finite number; got ${w}`);
    }
    if (w < 0) {
      throw new Error(`Weight for '${feat}' must be non-negative; got ${w}`);
    }
    total += w;
  }

  if (Math.abs(total - 1.0) > tolerance) {
    throw new Error(
      `Weights must sum to 1.0 within tolerance ${tolerance}; got sum ${total}`,
    );
  }
}

/**
 * Computes numeric similarity: 1 - |earth - target|, clamped to [0.0, 1.0].
 */
export function computeNumericSimilarity(
  earthVal: number | null | undefined,
  targetVal: number | null | undefined,
): number | null {
  if (earthVal === null || earthVal === undefined || targetVal === null || targetVal === undefined) {
    return null;
  }
  if (typeof earthVal !== 'number' || typeof targetVal !== 'number') {
    throw new Error('Continuous feature values must be numeric or null');
  }
  if (!Number.isFinite(earthVal) || !Number.isFinite(targetVal)) {
    throw new Error('Continuous feature values must be finite');
  }
  if (earthVal < 0.0 || earthVal > 1.0 || targetVal < 0.0 || targetVal > 1.0) {
    throw new Error(
      `Normalized values must be in [0.0, 1.0]; got earth=${earthVal}, target=${targetVal}`,
    );
  }

  const sim = 1.0 - Math.abs(earthVal - targetVal);
  return Math.max(0.0, Math.min(1.0, sim));
}

/**
 * Computes categorical rock/mineral similarity based on approved category groups.
 */
export function computeRockSimilarity(
  earthRock: string | null | undefined,
  targetRock: string | null | undefined,
  relatedGroups: string[][] = DEFAULT_RELATED_ROCK_GROUPS,
): number | null {
  if (!earthRock || !targetRock) {
    return null;
  }

  const e = earthRock.trim().toLowerCase();
  const t = targetRock.trim().toLowerCase();
  if (!e || !t) {
    return null;
  }

  if (e === t) {
    return 1.0;
  }

  for (const group of relatedGroups) {
    const groupNorm = group.map((item) => item.toLowerCase());
    if (groupNorm.includes(e) && groupNorm.includes(t)) {
      return 0.5;
    }
  }

  return 0.0;
}

/**
 * Classifies similarity into qualitative strength band.
 */
export function classifyStrengthBand(similarity: number | null | undefined): StrengthBand {
  if (similarity === null || similarity === undefined) {
    return 'UNAVAILABLE';
  }
  if (similarity >= 0.75) {
    return 'STRONG';
  }
  if (similarity >= 0.4) {
    return 'PARTIAL';
  }
  return 'WEAK';
}

/**
 * Calculates site-to-target similarity and composite score.
 */
export function calculateSiteScore(
  earthFeatures: Record<string, any>,
  targetFeatures: Record<string, any>,
  weights: Record<string, number>,
  options?: {
    relatedRockGroups?: string[][];
    minimumCoverage?: number;
  },
): ScoreResult {
  validateWeights(weights);

  const minimumCoverage = options?.minimumCoverage ?? MINIMUM_WEIGHTED_COVERAGE;
  const relatedGroups = options?.relatedRockGroups ?? DEFAULT_RELATED_ROCK_GROUPS;

  const similarities: Record<string, number | null> = {};
  const strengthBands: Record<string, StrengthBand> = {};
  const contributions: Record<string, number | null> = {};

  let weightedCoverage = 0;
  let weightedSum = 0;

  for (const [featId, weight] of Object.entries(weights)) {
    const earthVal = earthFeatures[featId];
    const targetVal = targetFeatures[featId];

    let sim: number | null;
    if (featId === 'rock_mineral') {
      sim = computeRockSimilarity(earthVal, targetVal, relatedGroups);
    } else {
      sim = computeNumericSimilarity(earthVal, targetVal);
    }

    similarities[featId] = sim;
    strengthBands[featId] = classifyStrengthBand(sim);

    if (sim !== null) {
      weightedCoverage += weight;
      const contrib = weight * sim;
      contributions[featId] = Math.round(contrib * 1e6) / 1e6;
      weightedSum += contrib;
    } else {
      contributions[featId] = null;
    }
  }

  weightedCoverage = Math.round(weightedCoverage * 1e4) / 1e4;
  const hasSufficientCoverage = weightedCoverage >= minimumCoverage;

  if (hasSufficientCoverage) {
    return {
      status: 'COMPUTED',
      statusReason: null,
      compositeScore: Math.round(weightedSum * 100 * 100) / 100,
      weightedCoverage,
      minimumCoverage,
      similarities,
      strengthBands,
      contributions,
    };
  }

  return {
    status: 'INSUFFICIENT_COVERAGE',
    statusReason: `Weighted coverage (${(weightedCoverage * 100).toFixed(1)}%) is below the required threshold (${(minimumCoverage * 100).toFixed(1)}%).`,
    compositeScore: null,
    weightedCoverage,
    minimumCoverage,
    similarities,
    strengthBands,
    contributions,
  };
}
