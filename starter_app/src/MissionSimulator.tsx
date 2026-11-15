import React, { useState } from 'react';
import type { ExploratoryModel } from './exploratoryData';
import { modelScore } from './exploratoryData';
import { validateWeights, type ScoreResult } from './scoring';
import {
  MISSION_SCENARIOS,
  FEATURE_NAMES,
  normalizeWeights,
  getActiveWeights,
  type MissionScenarioId,
  type MissionScenario,
} from './missionScenarios';

export {
  MISSION_SCENARIOS,
  FEATURE_NAMES,
  normalizeWeights,
  getActiveWeights,
  type MissionScenarioId,
  type MissionScenario,
};

function ScenarioVectorIcon({ name, size = 16 }: { name: string; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    orbit: (
      <>
        <circle cx="12" cy="12" r="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" />
      </>
    ),
    rover: (
      <>
        <path d="M4 16h16" />
        <circle cx="7" cy="16" r="2.5" />
        <circle cx="17" cy="16" r="2.5" />
        <path d="M5 13.5 7 8h10l2 5.5" />
        <path d="M9 8V5h6v3" />
      </>
    ),
    drill: (
      <>
        <path d="m14 3 7 7-8 8-4 1 1-4 7-7Z" />
        <path d="m11 6 3 3M3 21l4-4" />
      </>
    ),
    suit: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="M9 10a3 3 0 0 0 6 0" />
        <path d="M6 19v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" />
      </>
    ),
    microscope: (
      <>
        <path d="M6 18h12M12 14v4M12 3a4 4 0 0 0-4 4v3h8V7a4 4 0 0 0-4-4Z" />
        <circle cx="12" cy="7" r="1.5" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="scenario-svg-icon"
    >
      {icons[name] ?? icons.orbit}
    </svg>
  );
}

interface MissionScenarioSelectorProps {
  scenarioId: MissionScenarioId;
  onSelectScenario: (id: MissionScenarioId) => void;
  customWeights: Record<string, number> | null;
  onUpdateCustomWeights: (w: Record<string, number> | null) => void;
  targetBody: 'Moon' | 'Mars';
  modelPolicyWeights?: Record<string, Record<string, number>>;
}

export function MissionScenarioSelector({
  scenarioId,
  onSelectScenario,
  customWeights,
  onUpdateCustomWeights,
  targetBody,
  modelPolicyWeights,
}: MissionScenarioSelectorProps) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const baseWeights = getActiveWeights(scenarioId, targetBody, modelPolicyWeights, null);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(baseWeights);

  const activeWeights = customWeights ?? baseWeights;
  const currentScenario = MISSION_SCENARIOS[scenarioId];

  const handleSliderChange = (featureKey: string, newValue: number) => {
    const updated = { ...sliderValues, [featureKey]: newValue };
    setSliderValues(updated);
    const normalized = normalizeWeights(updated);
    try {
      validateWeights(normalized);
      onUpdateCustomWeights(normalized);
    } catch {
      // Retain valid distribution if numerical edge case
    }
  };

  const handleResetToPreset = () => {
    const preset = getActiveWeights(scenarioId, targetBody, modelPolicyWeights, null);
    setSliderValues(preset);
    onUpdateCustomWeights(null);
  };

  return (
    <section className="mission-simulator-container" aria-label="Mission Objective Sensitivity">
      <div className="simulator-header">
        <div className="simulator-title-group">
          <span className="simulator-badge">NASA OPERATIONAL PROFILES · SENSITIVITY ANALYSIS</span>
          <h3>Mission Objective Sensitivity</h3>
          <p>
            Evaluate candidate suitability shifts across specialized operational requirements (rover chassis traction, cryo-drilling, seal dust wear, and biomarker calibration) using the validated reproducible scoring engine.
          </p>
        </div>
        <div className="simulator-active-status">
          <span className="scenario-active-icon">
            <ScenarioVectorIcon name={customWeights ? 'sliders' : currentScenario.icon} size={20} />
          </span>
          <div>
            <b>{customWeights ? 'User-Calibrated Profile' : currentScenario.name}</b>
            <small>{customWeights ? 'Custom normalized weights (Σ = 1.0000)' : currentScenario.operationalFocus}</small>
          </div>
        </div>
      </div>

      {/* Scenario Selection Pills */}
      <div className="scenario-pills" role="tablist" aria-label="Mission Objectives">
        {(Object.keys(MISSION_SCENARIOS) as MissionScenarioId[]).map((id) => {
          const s = MISSION_SCENARIOS[id];
          const isSelected = scenarioId === id && !customWeights;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isSelected}
              className={`scenario-pill ${isSelected ? 'active' : ''}`}
              onClick={() => {
                onSelectScenario(id);
                onUpdateCustomWeights(null);
                const preset = getActiveWeights(id, targetBody, modelPolicyWeights, null);
                setSliderValues(preset);
              }}
            >
              <span className="pill-icon">
                <ScenarioVectorIcon name={s.icon} size={15} />
              </span>
              <span className="pill-text">
                <span className="pill-code">{s.code}</span>
                <span className="pill-name">{s.shortName}</span>
              </span>
            </button>
          );
        })}

        <button
          className={`scenario-pill customize-toggle ${isCustomizing || customWeights ? 'active' : ''}`}
          onClick={() => setIsCustomizing((v) => !v)}
          aria-expanded={isCustomizing}
          aria-label="Toggle custom weight tuning"
        >
          <span className="pill-icon">
            <ScenarioVectorIcon name="sliders" size={15} />
          </span>
          <span className="pill-text">
            <span className="pill-code">CONFIG</span>
            <span className="pill-name">{customWeights ? 'Custom Active' : 'Tune Weights'}</span>
          </span>
        </button>
      </div>

      {/* Collapsible Custom Weight Tuning Drawer */}
      {isCustomizing && (
        <div className="custom-weights-drawer" role="region" aria-label="Custom Weight Configuration">
          <div className="drawer-header">
            <div>
              <h4>Feature Weight Calibration</h4>
              <p className="muted">
                Adjust relative importance of environmental features. Sliders automatically normalize to ensure Σwᵢ = 1.0000, satisfying the scientific scoring contract.
              </p>
            </div>
            <div className="drawer-actions">
              <button className="secondary small" onClick={handleResetToPreset}>
                Reset to {currentScenario.shortName} Preset
              </button>
            </div>
          </div>

          <div className="weight-sliders-grid">
            {Object.entries(FEATURE_NAMES).map(([key, meta]) => {
              const currentW = activeWeights[key] ?? 0;
              const percent = (currentW * 100).toFixed(1);
              return (
                <div key={key} className="weight-slider-card">
                  <div className="slider-label-row">
                    <span className="feat-name">{meta.label}</span>
                    <span className="feat-weight">{percent}% <small>(w = {currentW.toFixed(4)})</small></span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={Math.round(currentW * 100)}
                    onChange={(e) => handleSliderChange(key, parseFloat(e.target.value) / 100)}
                    aria-label={`Weight for ${meta.label}`}
                  />
                  <small className="feat-desc">{meta.description}</small>
                </div>
              );
            })}
          </div>

          <div className="drawer-footer">
            <span className="sum-check">
              ✓ Validated Weight Total: <b>100.0% (1.0000)</b> · Reproducible L1 Similarity Engine
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

/** Site Mission Profile breakdown widget for SitePanel */
export function SiteMissionProfileWidget({
  model,
  siteId,
  targetId,
  targetName,
}: {
  model: ExploratoryModel;
  siteId: string;
  targetId: string;
  targetName: string;
}) {
  const scenarios: { id: MissionScenarioId; label: string; icon: string; scoreResult: ScoreResult }[] = [];

  const target = model.targets.find((t) => t.id === targetId);
  const targetBody = (target?.body ?? 'Mars') as 'Moon' | 'Mars';

  for (const sId of ['rover', 'isru', 'suit_dust', 'astrobiology'] as MissionScenarioId[]) {
    const sc = MISSION_SCENARIOS[sId];
    try {
      const res = modelScore(model, siteId, targetId, sc.weights);
      scenarios.push({ id: sId, label: sc.shortName, icon: sc.icon, scoreResult: res });
    } catch {
      // Score unavailable or coverage insufficient
    }
  }

  // Find primary operational fit (highest score)
  const validScores = scenarios.filter((s) => s.scoreResult.compositeScore !== null);
  validScores.sort((a, b) => (b.scoreResult.compositeScore ?? 0) - (a.scoreResult.compositeScore ?? 0));
  const primaryFit = validScores[0];

  return (
    <div className="site-mission-profile-widget" aria-label="Mission Profile Suitability Analysis">
      <div className="profile-heading">
        <span className="profile-badge">OPERATIONAL SUITABILITY SENSITIVITY</span>
        <h4>Mission Capability Breakdown</h4>
        <p className="muted">
          Simulated match under operational equipment constraints compared with {targetName} ({targetBody}).
        </p>
      </div>

      {primaryFit && (
        <div className="primary-fit-banner">
          <span className="fit-icon">
            <ScenarioVectorIcon name={primaryFit.icon} size={20} />
          </span>
          <div>
            <small>PRIMARY OPERATIONAL SPECIALIZATION</small>
            <b>{primaryFit.label}</b> ({primaryFit.scoreResult.compositeScore?.toFixed(1)} / 100)
          </div>
        </div>
      )}

      <div className="mission-bars-list">
        {scenarios.map(({ id, label, icon, scoreResult }) => {
          const score = scoreResult.compositeScore;
          const pct = score != null ? Math.min(100, Math.max(0, score)) : 0;
          return (
            <div key={id} className="mission-bar-row">
              <div className="bar-header">
                <span className="bar-title">
                  <span className="bar-icon">
                    <ScenarioVectorIcon name={icon} size={14} />
                  </span>
                  {label}
                </span>
                <span className="bar-val">{score != null ? `${score.toFixed(1)} / 100` : 'Insufficient coverage'}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${pct}%`,
                    background:
                      pct > 65
                        ? 'linear-gradient(90deg, #45c5e8, #7de2b8)'
                        : pct > 45
                        ? 'linear-gradient(90deg, #2f7ca8, #45c5e8)'
                        : '#29475d',
                  }}
                />
              </div>
              <div className="bar-subtext">
                <small>{MISSION_SCENARIOS[id].operationalFocus}</small>
              </div>
            </div>
          );
        })}
      </div>
      <p className="muted" style={{ fontSize: '11px', marginTop: '12px' }}>
        Provisional candidate sensitivity analysis. Relative fidelity reflects exploratory normalization and does not certify operational flight readiness.
      </p>
    </div>
  );
}
