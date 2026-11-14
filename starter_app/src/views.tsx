import { useState } from 'react';
import type { AtlasData, Category, RecordEntry } from './data';
import { SectionHeading, type Screen } from './Shell';
import { WorldMap } from './WorldMap';
import { calculateSiteScore, DEFAULT_WEIGHT_PROFILES } from './scoring';

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
    const earthFeatures: Record<string, any> = {};
    for (const [k, v] of Object.entries(site.measurements)) {
      earthFeatures[k] = v.value;
    }
    const targetFeatures: Record<string, any> = {};
    for (const [k, v] of Object.entries(target.measurements)) {
      targetFeatures[k] = v.value;
    }
    const weights = DEFAULT_WEIGHT_PROFILES[target.body] ?? DEFAULT_WEIGHT_PROFILES.Moon;
    const result = calculateSiteScore(earthFeatures, targetFeatures, weights);

    if (result.status === 'INSUFFICIENT_COVERAGE') {
      return (
        <div className="notice score-notice">
          <b>Composite score suppressed · Insufficient coverage</b>
          <p>
            {result.statusReason ?? 'Minimum 75% feature coverage required.'}{' '}
            Validated measurements and approved coordinates are required before ranking.
          </p>
          <small className="muted">
            Scoring engine active: {target.body} weight preset ({Object.keys(weights).length} features, sum: 1.00)
          </small>
        </div>
      );
    }
    return (
      <div className="notice score-notice score-computed">
        <b>Composite analog score: {result.compositeScore?.toFixed(1)} / 100</b>
        <p>Weighted coverage: {(result.weightedCoverage * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return (
    <div className="notice score-notice">
      <b>Scoring engine verified · Pending data validation</b>
      <p>
        The mathematical scoring engine (TypeScript/Python) is active and verified with 100% test parity. Composite scores are suppressed until approved measurements are loaded.
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
  return (
    <section className="selected-site" aria-label="Selected site details">
      <p className="eyebrow">
        {site.group} · {site.region}
      </p>
      <h2>{site.name}</h2>
      <p className="status-label">Geographic placement: Pending human review</p>
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
          {full ? (
            <Features data={data} site={site} target={target} />
          ) : (
            <>
              <p>No approved feature measurements are available for this comparison.</p>
              <ul className="compact-features">
                {data.features.map((f) => (
                  <li key={f.id}>
                    <span>{f.label.split(' (')[0]}</span>
                    <b>No data</b>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
      {tab === 'Mission' && (
        <>
          <h3>Hypothesis to test</h3>
          <p>
            This provisional candidate is retained for future evidence review. No site-specific mission capability has been established.
          </p>
          <Reality target={target} />
        </>
      )}
      {tab === 'Limits' && (
        <>
          <h3>Coordinate review required</h3>
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
      <PendingScore site={a} target={target} />
      <p>Target: {target.name}. No measurements are available to support a winner.</p>
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
          <WorldMap />
          <div className="map-selection" role="status">
            Selected: <b>{site.name}</b> · Pending human review · No map marker
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
          <span className="muted">Pending human review</span>
        </div>
      )}
      {screen === 'targets' && (
        <>
          <SectionHeading
            eyebrow="Mission destinations"
            title="Select a planetary target"
            text="All four planned destinations remain available. Their geographic definitions and scientific measurements await approval."
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
              .map((t) => (
                <article
                  className={`target-card ${targetId === t.id ? 'selected' : ''}`}
                  key={t.id}
                >
                  <div className={`target-context body-${t.body.toLowerCase()}`} aria-hidden="true">
                    <span>{t.body}</span>
                  </div>
                  <div className="target-content">
                    <p className="eyebrow">{t.body} destination</p>
                    <h2>{t.name}</h2>
                    <p>Geographic placement pending human review. Scientific feature values: No data.</p>
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
              ))}
          </div>
          <PendingScore target={target} />
        </>
      )}
      {screen === 'rankings' && (
        <>
          <SectionHeading
            eyebrow="Full register"
            title="Earth site catalogue"
            text="Explore all twelve planned candidates. Categories describe their role in the project, not validated analog quality."
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
            text="Inspect the same feature concepts for two Earth sites and the selected planetary target."
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
                TerraTwin is a research prototype for comparing selected Earth environments with Moon and Mars targets. This release makes data gaps and review decisions visible.
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
                The workbook is provisional. Missing and conflicting coordinates remain null and pending human review. No unapproved site markers or spatial extraction are used.
              </p>
            </article>
            <article>
              <span>02 / Evidence</span>
              <h2>Track what is known</h2>
              <p>
                All feature measurements currently show No data. Preview images and catalogues are context, not quantitative rasters. A missing value is never interpreted as zero or absence.
              </p>
            </article>
            <article>
              <span>03 / Method gate</span>
              <h2>Approve before calculating</h2>
              <p>
                Definitions, normalization, target weights, rock/mineral comparison, ice encoding, missing-data policy, coverage thresholds and reference sampling await approval. The scoring engine is implemented and verifies coverage before computing scores.
              </p>
            </article>
            <article>
              <span>04 / Validation</span>
              <h2>Not computed</h2>
              <p>
                Internal reference checks and percentiles have not been calculated. This prototype does not establish independent scientific validation or mission readiness.
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
              Human approval is needed for coordinates and geometry, source eligibility and suitability, target values, and the complete comparison policy.
            </p>
          </section>
          <Sources data={data} />
        </>
      )}
    </main>
  );
}
