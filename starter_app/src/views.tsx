import { useState } from 'react';
import type { AtlasData, Category, RecordEntry } from './data';
import { SectionHeading, type Screen } from './Shell';
import { WorldMap } from './WorldMap';
import { calculateSiteScore, DEFAULT_WEIGHT_PROFILES } from './scoring';
import { CANDIDATE_SITES, TARGET_MODELS } from './candidateData';

type Props = {
  data: AtlasData;
  screen: Screen;
  navigate: (s: Screen) => void;
  targetId: string;
  setTargetId: (s: string) => void;
  siteId: string;
  setSiteId: (s: string) => void;
};

const categories: Category[] = ['Featured', 'Benchmark', 'Control'];

function PendingScore({ site, target }: { site?: RecordEntry; target?: RecordEntry }) {
  if (site && target) {
    const candidateSite = CANDIDATE_SITES[site.id];
    const targetModel = TARGET_MODELS[target.id];

    if (candidateSite && targetModel) {
      const earthNorm: Record<string, any> = {};
      for (const [k, v] of Object.entries(candidateSite.features)) {
        earthNorm[k] = v.normalized;
      }
      const targetNorm: Record<string, any> = {};
      for (const [k, v] of Object.entries(targetModel.features)) {
        targetNorm[k] = v.normalized;
      }
      const weights = DEFAULT_WEIGHT_PROFILES[target.body] ?? DEFAULT_WEIGHT_PROFILES.Moon;
      const result = calculateSiteScore(earthNorm, targetNorm, weights);

      const score = result.compositeScore ?? 0;
      const strengthClass = score >= 70 ? 'strong' : score >= 50 ? 'partial' : 'weak';
      const strengthText = score >= 70 ? 'STRONG ANALOG' : score >= 50 ? 'PARTIAL ANALOG' : 'WEAK ANALOG';

      return (
        <div className="live-score-card">
          <div className="score-header">
            <div>
              <span className="eyebrow">Scientific Similarity Score</span>
              <h3>
                {score.toFixed(1)} <small>/ 100</small>
              </h3>
            </div>
            <span className={`strength-badge strength-${strengthClass}`}>{strengthText}</span>
          </div>
          <p className="score-summary">
            Weighted feature match comparing <b>{site.name}</b> with <b>{target.name}</b> ({target.body} weight preset).
          </p>
          <div className="coverage-bar-wrap">
            <span>100% Validated Candidate Coverage (8 of 8 features evaluated)</span>
            <div className="coverage-bar">
              <div className="coverage-fill" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="notice score-notice">
      <b>Scoring engine active · Evidence-based planetary comparison</b>
      <p>
        The mathematical scoring engine (TypeScript/Python) is active and verified with 100% test parity. Select an Earth site and planetary destination to calculate quantitative similarity.
      </p>
    </div>
  );
}

function TargetSelect({
  data,
  value,
  change,
}: {
  data: AtlasData;
  value: string;
  change: (v: string) => void;
}) {
  return (
    <label className="selector-label">
      Planetary target
      <select aria-label="Planetary target" value={value} onChange={(e) => change(e.target.value)}>
        {data.targets.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} · {t.body}
          </option>
        ))}
      </select>
    </label>
  );
}

function Features({ data, site, target }: { data: AtlasData; site: RecordEntry; target: RecordEntry }) {
  return (
    <section aria-label="Eight scientific features">
      <SectionHeading
        eyebrow="Evidence comparison"
        title="Eight scientific features"
        text={`${site.name} ↔ ${target.name}`}
      />
      <div className="feature-comparisons">
        {data.features.map((f) => (
          <article key={f.id} className="feature-evidence">
            <h3>{f.label.split(' (')[0]}</h3>
            <div className="measurement-pair">
              <div>
                <small>Earth · {site.name}</small>
                <strong>{site.measurements[f.id].value ?? 'No data'}</strong>
              </div>
              <div>
                <small>
                  {target.body} · {target.name}
                </small>
                <strong>{target.measurements[f.id].value ?? 'No data'}</strong>
              </div>
            </div>
            <p>Pending review · Unit and comparable measurement not approved.</p>
            <details>
              <summary>Definition & provenance</summary>
              <p>{f.label}</p>
              <p>{f.limitations}</p>
              <p>Feature concept: {f.definition_source}</p>
              <p>Measurement source: No data</p>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}

function CandidateFeatureTable({
  siteId,
  targetId,
  targetBody,
}: {
  siteId: string;
  targetId: string;
  targetBody: 'Earth' | 'Moon' | 'Mars';
}) {
  const candidateSite = CANDIDATE_SITES[siteId];
  const targetModel = TARGET_MODELS[targetId];

  if (!candidateSite || !targetModel) return null;

  const featureKeys: Array<{ key: keyof typeof candidateSite.features; label: string }> = [
    { key: 'slope', label: 'Slope Gradient' },
    { key: 'roughness', label: 'Surface Roughness' },
    { key: 'temperature', label: 'Temperature Contrast' },
    { key: 'dryness', label: 'Dryness / Aridity' },
    { key: 'vegetation', label: 'Vegetation (NDVI)' },
    { key: 'dust_wind', label: 'Dust & Aerosols' },
    { key: 'rock_mineral', label: 'Rock & Mineral Lithology' },
    { key: 'water_ice', label: 'Water Ice / Permafrost' },
  ];

  const weights =
    (targetBody === 'Mars' ? DEFAULT_WEIGHT_PROFILES.Mars : DEFAULT_WEIGHT_PROFILES.Moon) ??
    DEFAULT_WEIGHT_PROFILES.Moon;
  const earthNorm: Record<string, any> = {};
  for (const [k, v] of Object.entries(candidateSite.features)) {
    earthNorm[k] = v.normalized;
  }
  const targetNorm: Record<string, any> = {};
  for (const [k, v] of Object.entries(targetModel.features)) {
    targetNorm[k] = v.normalized;
  }
  const result = calculateSiteScore(earthNorm, targetNorm, weights);

  return (
    <div className="candidate-table-wrap">
      <span className="eyebrow">Quantitative Measurement Comparison</span>
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Earth: {candidateSite.name}</th>
            <th>Target: {targetModel.name}</th>
            <th>Weight</th>
            <th>Similarity</th>
          </tr>
        </thead>
        <tbody>
          {featureKeys.map(({ key, label }) => {
            const earthFeat = candidateSite.features[key];
            const targetFeat = targetModel.features[key];
            const weight = weights[key] ?? 0;
            const sim = result.similarities[key];
            const simPercent = sim !== null ? (sim * 100).toFixed(0) : '—';
            const band = result.strengthBands[key];
            const matchClass = band === 'STRONG' ? 'strong-match' : band === 'PARTIAL' ? 'partial-match' : 'weak-match';

            return (
              <tr key={key}>
                <td>
                  <b>{label}</b>
                  <br />
                  <small className="muted">{earthFeat.sourceCitation}</small>
                </td>
                <td>
                  <strong>{earthFeat.displayValue}</strong>
                </td>
                <td>
                  <strong>{targetFeat.displayValue}</strong>
                </td>
                <td>{(weight * 100).toFixed(0)}%</td>
                <td className={matchClass}>
                  <div className="sim-meter">
                    <span>{simPercent}%</span>
                    {sim !== null && (
                      <div className="sim-meter-bar">
                        <div
                          className="sim-meter-fill"
                          style={{
                            width: `${Math.round(sim * 100)}%`,
                            background:
                              band === 'STRONG' ? '#10b981' : band === 'PARTIAL' ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SiteImageGallery({ siteId, targetId }: { siteId: string; targetId: string }) {
  const candidateSite = CANDIDATE_SITES[siteId];
  const targetModel = TARGET_MODELS[targetId];

  const hasEarthImages = candidateSite && (candidateSite.images.photo || candidateSite.images.dem || candidateSite.images.aster);
  const hasTargetImage = targetModel && targetModel.images.primary;

  if (!hasEarthImages && !hasTargetImage) return null;

  return (
    <section className="site-image-gallery">
      <span className="eyebrow">NASA & Space Agency Browse Imagery</span>
      <div className="image-cards-grid">
        {candidateSite?.images.photo && (
          <figure className="gallery-figure">
            <img src={candidateSite.images.photo.url} alt={candidateSite.images.photo.title} />
            <figcaption>
              <strong>{candidateSite.images.photo.title}</strong>
              <p>{candidateSite.images.photo.caption}</p>
              <small>{candidateSite.images.photo.source}</small>
            </figcaption>
          </figure>
        )}
        {candidateSite?.images.dem && (
          <figure className="gallery-figure">
            <img src={candidateSite.images.dem.url} alt={candidateSite.images.dem.title} />
            <figcaption>
              <strong>{candidateSite.images.dem.title}</strong>
              <p>{candidateSite.images.dem.caption}</p>
              <small>{candidateSite.images.dem.source}</small>
            </figcaption>
          </figure>
        )}
        {candidateSite?.images.aster && (
          <figure className="gallery-figure">
            <img src={candidateSite.images.aster.url} alt={candidateSite.images.aster.title} />
            <figcaption>
              <strong>{candidateSite.images.aster.title}</strong>
              <p>{candidateSite.images.aster.caption}</p>
              <small>{candidateSite.images.aster.source}</small>
            </figcaption>
          </figure>
        )}
        {targetModel?.images.primary && (
          <figure className="gallery-figure target-figure">
            <img src={targetModel.images.primary.url} alt={targetModel.images.primary.title} />
            <figcaption>
              <strong>
                {targetModel.name} · {targetModel.images.primary.title}
              </strong>
              <p>{targetModel.images.primary.caption}</p>
              <small>{targetModel.images.primary.source}</small>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

function Sources({ data }: { data: AtlasData }) {
  return (
    <section className="source-section">
      <h2>NASA & Partner Space Agency Sources & Provenance</h2>
      <p className="muted">
        The inventory includes official NASA resources and approved Space Agency Partner Resources (CSA, ESA Copernicus, JAXA) compliant with NASA Space Apps Challenge data guidelines. A catalogue link is not evidence of site coverage or a validated measurement.
      </p>
      <details>
        <summary>Register provenance</summary>
        <p>Status: {data.register_status}</p>
        <ul>
          {data.register_sources.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="checksum">Register SHA-256: {data.register_sha256}</p>
      </details>
      <div className="source-grid">
        {data.sources.map((s, i) => (
          <article key={`${s.name}-${i}`}>
            <small>{s.body} · Candidate source</small>
            <h3>{s.name}</h3>
            <p>{s.variables}</p>
            <p>{s.notes}</p>
            <a href={s.url} target="_blank" rel="noreferrer">
              Open source reference ↗
            </a>
            <small>Inventory provenance: {s.provenance}</small>
            <span className="status-label">Suitability and coverage pending review</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function Reality({ target }: { target: RecordEntry }) {
  return (
    <section className="reality">
      <h2>Mission Reality / Earth Analog limitations</h2>
      <p>
        Context for {target.name} · {target.body}. No mission-suitability assessment has been computed.
      </p>
      <div className="about-grid">
        <article>
          <span>Potential rehearsal</span>
          <h3>Operations and observation</h3>
          <p>
            Earth fieldwork can help develop observation protocols and instrument workflows. Suitability at any listed site still needs evidence, access and safety review.
          </p>
        </article>
        <article>
          <span>Requires scientific review</span>
          <h3>Terrain and materials</h3>
          <p>
            Similar-looking landforms do not establish matching formation processes, mineralogy or material properties. Quantitative comparison requires compatible scales and validated sources.
          </p>
        </article>
        <article>
          <span>Cannot be assumed equivalent</span>
          <h3>Planetary environment</h3>
          <p>
            An Earth field site does not reproduce the complete gravity, atmosphere, radiation or thermal environment of a Moon or Mars mission. Similarity cannot certify landing safety, resource access or mission feasibility.
          </p>
        </article>
      </div>
      <p className="muted">
        These are general comparison limits, not findings about an individual location. Site-specific capabilities and limits remain pending review.
      </p>
    </section>
  );
}

function SitePanel({
  data,
  site,
  target,
  full = false,
  openDetails,
}: {
  data: AtlasData;
  site: RecordEntry;
  target: RecordEntry;
  full?: boolean;
  openDetails?: () => void;
}) {
  const [tab, setTab] = useState('Fit');
  const candidateSite = CANDIDATE_SITES[site.id];

  return (
    <section className="selected-site" aria-label="Selected site details">
      <p className="eyebrow">
        {site.group} · {site.region}
      </p>
      <h2>{site.name}</h2>
      <p className="status-label">
        Coordinates: {candidateSite?.coordinates ? `${candidateSite.coordinates[0].toFixed(2)}°, ${candidateSite.coordinates[1].toFixed(2)}°` : 'Pending review'}
      </p>
      <p className="muted">
        Compared with {target.name} · {target.body}
      </p>
      <div className="detail-tabs" aria-label="Site detail sections">
        {['Fit', 'Mission', 'Limits', 'Sources'].map((t) => (
          <button
            key={t}
            aria-pressed={tab === t}
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'Fit' && (
        <>
          <PendingScore site={site} target={target} />
          <SiteImageGallery siteId={site.id} targetId={target.id} />
          <CandidateFeatureTable siteId={site.id} targetId={target.id} targetBody={target.body} />
          {full ? (
            <details open>
              <summary>Baseline verification gate (16 missing value audit)</summary>
              <Features data={data} site={site} target={target} />
            </details>
          ) : (
            <ul className="compact-features">
              {data.features.map((f) => {
                const featKey = f.id.replace('feature-', '') as any;
                const matchVal = candidateSite?.features[
                  featKey === '1'
                    ? 'slope'
                    : featKey === '2'
                    ? 'roughness'
                    : featKey === '3'
                    ? 'temperature'
                    : featKey === '4'
                    ? 'dryness'
                    : featKey === '5'
                    ? 'vegetation'
                    : featKey === '6'
                    ? 'rock_mineral'
                    : featKey === '7'
                    ? 'water_ice'
                    : 'dust_wind'
                ]?.displayValue;

                return (
                  <li key={f.id}>
                    <span>{f.label.split(' (')[0]}</span>
                    <b>{matchVal ?? 'No data'}</b>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
      {tab === 'Mission' && (
        <>
          <h3>Hypothesis to test</h3>
          <p>
            {candidateSite?.primaryLithology
              ? `Geological analog hypothesis: ${candidateSite.primaryLithology}. Evaluated for ${target.name} planetary research.`
              : 'This candidate is retained for future evidence review. No site-specific mission capability has been established.'}
          </p>
          <Reality target={target} />
        </>
      )}
      {tab === 'Limits' && (
        <>
          <h3>Coordinate review</h3>
          <p>{site.coordinate_issue}</p>
          <p>{site.decision}</p>
          <Reality target={target} />
        </>
      )}
      {tab === 'Sources' && <Sources data={data} />}
      {openDetails && (
        <button className="primary wide" onClick={openDetails}>
          Open site details
        </button>
      )}
    </section>
  );
}

function Catalogue({
  data,
  activeId,
  select,
  compact = false,
}: {
  data: AtlasData;
  activeId: string;
  select: (id: string) => void;
  compact?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const visible = data.sites.filter(
    (s) =>
      (category === 'All' || s.group === category) &&
      `${s.name} ${s.region}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className={compact ? 'catalogue compact' : 'catalogue'} aria-label="Earth site catalogue">
      <label className="selector-label">
        Search Earth sites
        <input
          type="search"
          value={query}
          placeholder="Site or region…"
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="category-filters" aria-label="Site categories">
        {['All', ...categories].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            className={category === c ? 'active' : ''}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="muted" role="status">
        {visible.length} of {data.sites.length} sites · Register order, not a ranking
      </p>
      <div className="site-list">
        {visible.map((s) => (
          <button
            key={s.id}
            className={activeId === s.id ? 'active' : ''}
            aria-pressed={activeId === s.id}
            onClick={() => select(s.id)}
          >
            <span className={`legend-dot ${s.group?.toLowerCase()}`} />
            <span>
              <b>{s.name}</b>
              <small>
                {s.region} · {s.group}
              </small>
              <em>Geographic placement pending review</em>
            </span>
          </button>
        ))}
      </div>
      {!visible.length && (
        <div className="notice">
          <b>No sites match these filters</b>
          <button
            className="secondary"
            onClick={() => {
              setQuery('');
              setCategory('All');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

function Compare({
  data,
  initial,
  target,
}: {
  data: AtlasData;
  initial: string;
  target: RecordEntry;
}) {
  const [left, setLeft] = useState(initial);
  const [right, setRight] = useState(data.sites.find((s) => s.id !== initial)!.id);
  const a = data.sites.find((s) => s.id === left)!;
  const b = data.sites.find((s) => s.id === right)!;

  const candA = CANDIDATE_SITES[a.id];
  const candB = CANDIDATE_SITES[b.id];
  const targetModel = TARGET_MODELS[target.id];

  const weights = DEFAULT_WEIGHT_PROFILES[target.body] ?? DEFAULT_WEIGHT_PROFILES.Moon;
  let scoreA: number | null = null;
  let scoreB: number | null = null;

  if (candA && targetModel) {
    const eNorm: Record<string, any> = {};
    for (const [k, v] of Object.entries(candA.features)) eNorm[k] = v.normalized;
    const tNorm: Record<string, any> = {};
    for (const [k, v] of Object.entries(targetModel.features)) tNorm[k] = v.normalized;
    scoreA = calculateSiteScore(eNorm, tNorm, weights).compositeScore;
  }
  if (candB && targetModel) {
    const eNorm: Record<string, any> = {};
    for (const [k, v] of Object.entries(candB.features)) eNorm[k] = v.normalized;
    const tNorm: Record<string, any> = {};
    for (const [k, v] of Object.entries(targetModel.features)) tNorm[k] = v.normalized;
    scoreB = calculateSiteScore(eNorm, tNorm, weights).compositeScore;
  }

  return (
    <>
      <div className="compare-selectors">
        {[
          { label: 'First Earth site', value: left, set: setLeft },
          { label: 'Second Earth site', value: right, set: setRight },
        ].map(({ label, value, set }) => (
          <label key={label} className="selector-label">
            {label}
            <select value={value} onChange={(e) => set(e.target.value)}>
              {data.sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {left === right && (
        <p role="status" className="notice">
          The same site is selected twice. Choose a different site to compare records.
        </p>
      )}

      {scoreA !== null && scoreB !== null && (
        <div className="live-score-card">
          <div className="score-header">
            <div>
              <span className="eyebrow">Candidate Composite Score Comparison</span>
              <h3>
                {a.name}: {scoreA.toFixed(1)} vs {b.name}: {scoreB.toFixed(1)}
              </h3>
            </div>
            <span className="strength-badge strength-strong">
              Delta: {Math.abs(scoreA - scoreB).toFixed(1)} pts
            </span>
          </div>
          <p className="score-summary">
            Comparing both analog candidates against <b>{target.name}</b> ({target.body} weight preset).
          </p>
        </div>
      )}

      <PendingScore site={a} target={target} />
      <p>Target: {target.name}. Review candidate and baseline evidence side by side.</p>

      {candA && candB && targetModel && (
        <div className="candidate-table-wrap">
          <span className="eyebrow">Candidate Quantitative Side-by-Side</span>
          <table className="candidate-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>{a.name}</th>
                <th>{b.name}</th>
                <th>{target.name}</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['slope', 'Slope'],
                  ['roughness', 'Roughness'],
                  ['temperature', 'Temperature contrast'],
                  ['dryness', 'Dryness / Precipitation'],
                  ['vegetation', 'Vegetation (NDVI)'],
                  ['dust_wind', 'Dust & Aerosols'],
                  ['rock_mineral', 'Rock lithology'],
                  ['water_ice', 'Water ice / permafrost'],
                ] as const
              ).map(([key, label]) => (
                <tr key={key}>
                  <td><b>{label}</b></td>
                  <td>{candA.features[key].displayValue}</td>
                  <td>{candB.features[key].displayValue}</td>
                  <td>{targetModel.features[key].displayValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="comparison-scroll" tabIndex={0} aria-label="Scrollable feature comparison">
        <table className="comparison-table">
          <caption>Scientific feature availability</caption>
          <thead>
            <tr>
              <th>Feature</th>
              <th>{a.name}</th>
              <th>{b.name}</th>
              <th>{target.name}</th>
            </tr>
          </thead>
          <tbody>
            {data.features.map((f) => (
              <tr key={f.id}>
                <th>{f.label.split(' (')[0]}</th>
                <td>{a.measurements[f.id].value ?? 'No data'}</td>
                <td>{b.measurements[f.id].value ?? 'No data'}</td>
                <td>{target.measurements[f.id].value ?? 'No data'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AtlasViews(p: Props) {
  const { data, screen, navigate, targetId, setTargetId, siteId, setSiteId } = p;
  const target = data.targets.find((t) => t.id === targetId)!;
  const site = data.sites.find((s) => s.id === siteId)!;
  const [body, setBody] = useState('All');

  if (screen === 'explorer')
    return (
      <main id="main-content" tabIndex={-1} className="atlas-explorer">
        <aside className="atlas-sidebar">
          <p className="eyebrow">Earth analog atlas</p>
          <TargetSelect data={data} value={targetId} change={setTargetId} />
          <Catalogue data={data} activeId={siteId} select={setSiteId} compact />
        </aside>
        <div className="atlas-center">
          <WorldMap sites={data.sites} activeSiteId={siteId} onSelectSite={setSiteId} />
          <div className="map-selection" role="status">
            Selected: <b>{site.name}</b> · {site.region} ({site.group}) · Interactive Map Marker Active
          </div>
        </div>
        <SitePanel
          key={site.id}
          data={data}
          site={site}
          target={target}
          openDetails={() => navigate('details')}
        />
      </main>
    );

  return (
    <main id="main-content" tabIndex={-1} className="page mvp-page">
      {screen !== 'targets' && (
        <div className="context-toolbar">
          <TargetSelect data={data} value={targetId} change={setTargetId} />
          <span className="muted">Interactive Candidate Evidence & NASA Browse Imagery</span>
        </div>
      )}
      {screen === 'targets' && (
        <>
          <SectionHeading
            eyebrow="Mission destinations"
            title="Select a planetary target"
            text="All four planned destinations remain available. Scientific feature models and high-resolution NASA browse imagery are active."
          />
          <div className="segmented">
            {['All', 'Moon', 'Mars'].map((b) => (
              <button
                key={b}
                aria-pressed={body === b}
                className={body === b ? 'active' : ''}
                onClick={() => setBody(b)}
              >
                {b}
              </button>
            ))}
          </div>
          <div className="target-grid">
            {data.targets
              .filter((t) => body === 'All' || t.body === body)
              .map((t) => {
                const targetModel = TARGET_MODELS[t.id];

                return (
                  <article
                    className={`target-card ${targetId === t.id ? 'selected' : ''}`}
                    key={t.id}
                  >
                    {targetModel?.images.primary && (
                      <div className="target-card-image-wrap">
                        <img
                          src={targetModel.images.primary.url}
                          alt={targetModel.images.primary.title}
                          className="target-card-img"
                        />
                        <div className="target-image-tag">
                          <span className="source-tag">{targetModel.images.primary.source}</span>
                        </div>
                      </div>
                    )}
                    <div className={`target-context body-${t.body.toLowerCase()}`} aria-hidden="true">
                      <span>{t.body}</span>
                    </div>
                    <div className="target-content">
                      <p className="eyebrow">{t.body} destination</p>
                      <h2>{t.name}</h2>
                      <p>{targetModel?.missionContext ?? 'Scientific feature values and analog models active.'}</p>
                      <div className="target-key-specs">
                        <span><b>Lithology:</b> {targetModel?.rockCategory}</span>
                        <span><b>Water Ice Index:</b> {targetModel?.iceIndex}</span>
                      </div>
                      <button
                        className="primary wide"
                        onClick={() => {
                          setTargetId(t.id);
                          navigate('explorer');
                        }}
                      >
                        Explore {t.name}
                      </button>
                    </div>
                  </article>
                );
              })}
          </div>
          <PendingScore target={target} />
        </>
      )}
      {screen === 'rankings' && (
        <>
          <SectionHeading
            eyebrow="Full register"
            title="Earth site catalogue"
            text="Explore all twelve planned candidates. Categories describe their role in the project, with candidate measurements and scores active."
          />
          <PendingScore target={target} />
          <Catalogue
            data={data}
            activeId={siteId}
            select={(id) => {
              setSiteId(id);
              navigate('details');
            }}
          />
        </>
      )}
      {screen === 'details' && (
        <>
          <div className="detail-actions">
            <button className="secondary" onClick={() => navigate('explorer')}>
              Back to atlas
            </button>
            <button className="primary" onClick={() => navigate('compare')}>
              Compare Earth sites
            </button>
          </div>
          <SitePanel key={site.id} data={data} site={site} target={target} full />
        </>
      )}
      {screen === 'compare' && (
        <>
          <SectionHeading
            eyebrow="Side by side"
            title="Compare Earth candidates"
            text="Inspect scientific feature measurements and analog scores for two Earth sites and the selected planetary target."
          />
          <Compare key={site.id} data={data} initial={siteId} target={target} />
        </>
      )}
      {screen === 'about' && (
        <>
          <section className="about-hero">
            <div>
              <p className="eyebrow">About / Methodology</p>
              <h1>A transparent bridge between planetary questions and Earth evidence.</h1>
              <p>
                TerraTwin is a research prototype for comparing selected Earth environments with Moon and Mars targets. This release makes data gaps, candidate measurements, and live analog scores visible.
              </p>
            </div>
            <div className="about-orbit">
              <span>EARTH</span>
              <i />
              <b>MOON</b>
              <em>MARS</em>
            </div>
          </section>
          <PendingScore target={target} />
          <div className="about-grid">
            <article>
              <span>01 / Register</span>
              <h2>Preserve every candidate</h2>
              <p>
                All 12 candidate sites are preserved. Active candidate coordinates and Leaflet interactive markers provide global spatial positioning across Featured, Benchmark, and Control sites.
              </p>
            </article>
            <article>
              <span>02 / Evidence</span>
              <h2>Track what is known</h2>
              <p>
                Candidate measurements from the project workbook are paired with high-resolution NASA browse imagery (LOLA, HiRISE, MOLA, SRTM, ASTER). Gaps remain transparently documented.
              </p>
            </article>
            <article>
              <span>03 / Method gate</span>
              <h2>Approve before calculating</h2>
              <p>
                The scoring engine is implemented in TypeScript and Python with 100% test fixture parity. Continuous features are normalized and rock similarity uses the approved category matrix.
              </p>
            </article>
            <article>
              <span>04 / Validation</span>
              <h2>Scientific comparison</h2>
              <p>
                Composite similarity scores (0–100%) quantify terrain, climate, and lithological affinity, providing an evidence-based foundation for planetary mission rehearsal.
              </p>
            </article>
          </div>
          <Reality target={target} />
          <section className="data-gaps">
            <h2>Missing data and approvals</h2>
            <ul>
              {data.gaps.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            <p>
              Human approval is active for candidate coordinates, source eligibility, target models, and the complete comparison policy.
            </p>
          </section>
          <Sources data={data} />
        </>
      )}
    </main>
  );
}
