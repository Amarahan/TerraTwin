import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MISSION_SCENARIOS, normalizeWeights, getActiveWeights, type MissionScenarioId } from '../src/missionScenarios.ts';
import { validateWeights } from '../src/scoring.ts';
import { parseExploratoryModel, modelScore } from '../src/exploratoryData.ts';
import { parseAtlas } from '../src/data.ts';

const raw = JSON.parse(readFileSync(new URL('../public/data/exploratory-model.json', import.meta.url), 'utf8'));
const atlas = parseAtlas(JSON.parse(readFileSync(new URL('../public/data/atlas.json', import.meta.url), 'utf8')));
const model = parseExploratoryModel(raw, atlas);

test('all mission scenario presets strictly satisfy scientific weight validation', () => {
  for (const [id, scenario] of Object.entries(MISSION_SCENARIOS)) {
    assert.doesNotThrow(
      () => validateWeights(scenario.weights),
      `Scenario '${id}' weights must satisfy validateWeights`
    );
    const sum = Object.values(scenario.weights).reduce((a, b) => a + b, 0);
    assert.ok(
      Math.abs(sum - 1.0) <= 1e-4,
      `Scenario '${id}' sum (${sum}) must be within 1e-4 of 1.0000`
    );
  }
});

test('normalizeWeights dynamically balances arbitrary slider values to 1.0000', () => {
  const arbitrary = {
    slope: 50,
    roughness: 30,
    temperature: 20,
    water_ice: 0,
    rock_mineral: 0,
    dryness: 0,
    vegetation: 0,
    dust_wind: 0,
  };
  const normalized = normalizeWeights(arbitrary);
  assert.doesNotThrow(() => validateWeights(normalized));
  assert.equal(normalized.slope, 0.5);
  assert.equal(normalized.roughness, 0.3);
  assert.equal(normalized.temperature, 0.2);
});

test('all 12 sites evaluate cleanly under all 5 mission scenarios without error', () => {
  const scenarioIds: MissionScenarioId[] = ['baseline', 'rover', 'isru', 'suit_dust', 'astrobiology'];
  for (const sId of scenarioIds) {
    const weights = getActiveWeights(sId, 'Mars', model.policy.weights, null);
    for (const site of model.sites) {
      const res = modelScore(model, site.id, 'jezero-crater', weights);
      assert.ok(res.status === 'COMPUTED' || res.status === 'INSUFFICIENT_COVERAGE');
      if (res.compositeScore !== null) {
        assert.ok(res.compositeScore >= 0 && res.compositeScore <= 100);
      }
    }
  }
});
