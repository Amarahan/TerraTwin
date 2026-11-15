import { validateWeights } from './scoring.ts';

export type MissionScenarioId = 'baseline' | 'rover' | 'isru' | 'suit_dust' | 'astrobiology';

export interface MissionScenario {
  id: MissionScenarioId;
  code: string;
  name: string;
  shortName: string;
  badge: string;
  icon: string;
  description: string;
  operationalFocus: string;
  weights: Record<string, number>;
}

export const FEATURE_NAMES: Record<string, { label: string; unit: string; description: string }> = {
  slope: { label: 'Topographic Slope', unit: '°', description: 'Gradient incline & steep slope navigation' },
  roughness: { label: 'Surface Roughness', unit: 'σ/m', description: 'Micro-relief & boulder field obstacles' },
  temperature: { label: 'Thermal Amplitude', unit: 'K', description: 'Diurnal day-night temperature swing' },
  dryness: { label: 'Hyper-Aridity', unit: 'index', description: 'Moisture deficit & evaporative stress' },
  vegetation: { label: 'Terrain Bareness', unit: 'NDVI', description: 'Absence of terrestrial vegetation/biomass' },
  rock_mineral: { label: 'Lithology & Minerals', unit: 'category', description: 'Diagnostic mineral & rock composition' },
  water_ice: { label: 'Water Ice & Cryosphere', unit: 'permafrost', description: 'Subsurface permafrost & ice presence' },
  dust_wind: { label: 'Aeolian Dust & Wind', unit: 'proxy', description: 'Atmospheric particulate & wind stress' },
};

export const MISSION_SCENARIOS: Record<MissionScenarioId, MissionScenario> = {
  baseline: {
    id: 'baseline',
    code: '01 / REF',
    name: 'General Planetary Fit',
    shortName: 'Baseline Fit',
    badge: 'Standard Policy',
    icon: 'orbit',
    description: 'Balanced exploratory profile representing composite planetary terrain, thermal amplitude, and composition.',
    operationalFocus: 'General analog validation across all 8 documented environmental dimensions.',
    weights: {
      slope: 0.12,
      roughness: 0.10,
      temperature: 0.10,
      water_ice: 0.08,
      rock_mineral: 0.22,
      dryness: 0.18,
      vegetation: 0.05,
      dust_wind: 0.15,
    },
  },
  rover: {
    id: 'rover',
    code: '02 / ROV',
    name: 'Rover Mobility & Chassis Navigation',
    shortName: 'Rover Mobility',
    badge: 'Mobility & Obstacles',
    icon: 'rover',
    description: 'Prioritizes steep topographic slopes, micro-roughness, and rock hazards for testing wheel traction, chassis clearance, and obstacle bypass.',
    operationalFocus: 'Traction mechanics, slope climbing stability, wheel slip, suspension wear, and boulder field pathfinding.',
    weights: {
      slope: 0.35,
      roughness: 0.35,
      rock_mineral: 0.12,
      dust_wind: 0.10,
      dryness: 0.05,
      temperature: 0.03,
      water_ice: 0.00,
      vegetation: 0.00,
    },
  },
  isru: {
    id: 'isru',
    code: '03 / ISRU',
    name: 'ISRU Subsurface Ice & Cryo-Drilling',
    shortName: 'ISRU Cryo-Drilling',
    badge: 'Resource Extraction',
    icon: 'drill',
    description: 'Prioritizes cryogenic permafrost index, thermal contrast, and hyper-aridity for validating deep core drills and volatile sublimators.',
    operationalFocus: 'Deep regolith coring, cryogenic ground stability, volatile ice extraction, and borehole wall integrity.',
    weights: {
      water_ice: 0.40,
      temperature: 0.25,
      dryness: 0.15,
      rock_mineral: 0.10,
      slope: 0.05,
      roughness: 0.05,
      vegetation: 0.00,
      dust_wind: 0.00,
    },
  },
  suit_dust: {
    id: 'suit_dust',
    code: '04 / EVA',
    name: 'EVA Space Suit & Mechanism Dust Abrasion',
    shortName: 'EVA Suit & Dust',
    badge: 'Dust Hazard',
    icon: 'suit',
    description: 'Prioritizes aeolian particulate stress, hyper-aridity, and abrasive minerals to test spacesuit joint seals, visors, and radiator fouling.',
    operationalFocus: 'Abrasive particle penetration, electrostatic adhesion, rotary seal longevity, and thermal radiator dusting.',
    weights: {
      dust_wind: 0.35,
      dryness: 0.25,
      rock_mineral: 0.18,
      roughness: 0.10,
      temperature: 0.08,
      slope: 0.04,
      water_ice: 0.00,
      vegetation: 0.00,
    },
  },
  astrobiology: {
    id: 'astrobiology',
    code: '05 / BIO',
    name: 'Astrobiology & Biosignature Sampling',
    shortName: 'Astrobiology',
    badge: 'Biosignatures',
    icon: 'microscope',
    description: 'Prioritizes diagnostic lithologies (smectites, jarosite, carbonates), hyper-aridity, and bare terrain with minimal terrestrial biomass background.',
    operationalFocus: 'Raman / fluorescence spectrometer calibration, trace biomarker extraction in low-biomass soils, and sample preservation.',
    weights: {
      rock_mineral: 0.35,
      dryness: 0.25,
      vegetation: 0.20,
      temperature: 0.10,
      roughness: 0.05,
      slope: 0.05,
      water_ice: 0.00,
      dust_wind: 0.00,
    },
  },
};

/** Normalizes raw slider values so their sum equals exactly 1.0000 within tolerance. */
export function normalizeWeights(raw: Record<string, number>): Record<string, number> {
  const keys = Object.keys(raw);
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  if (total <= 0) {
    const equalWeight = 1 / keys.length;
    return Object.fromEntries(keys.map((k) => [k, equalWeight]));
  }
  const normalized: Record<string, number> = {};
  let currentSum = 0;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const val = Math.round((raw[k] / total) * 10000) / 10000;
    normalized[k] = val;
    currentSum += val;
  }
  const lastKey = keys[keys.length - 1];
  normalized[lastKey] = Math.max(0, Math.round((1.0 - currentSum) * 10000) / 10000);
  return normalized;
}

/** Resolves active weights for a given scenario, body, and optional custom weights. */
export function getActiveWeights(
  scenarioId: MissionScenarioId,
  targetBody: 'Moon' | 'Mars',
  modelPolicyWeights?: Record<string, Record<string, number>>,
  customWeights?: Record<string, number> | null
): Record<string, number> {
  if (customWeights) return customWeights;
  if (scenarioId === 'baseline' && modelPolicyWeights?.[targetBody]) {
    return modelPolicyWeights[targetBody];
  }
  return MISSION_SCENARIOS[scenarioId].weights;
}
