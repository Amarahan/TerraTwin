import { useState } from 'react';
import type { AtlasData, Category, RecordEntry } from './data';
import { SectionHeading, Icon, type Screen } from './Shell';
import { WorldMap } from './WorldMap';
import { ModelScore, ModelStatus, ModelMethod, Reading, useExploratory } from './ExploratoryModel';
import { modelScore } from './exploratoryData';
import { WorkbookReadings } from './WorkbookEvidence';
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
function matchesQuery(site: RecordEntry, query: string) {
  return `${site.name} ${site.region ?? ''} ${CANDIDATE_SITES[site.id]?.primaryLithology ?? ''}`.toLowerCase().includes(query.trim().toLowerCase());
}

function PendingScore({ site, target }: { site?: RecordEntry; target?: RecordEntry }) {
  return <ModelScore siteId={site?.id} targetId={target?.id}/>;
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

function Features({data,site,target}:{data:AtlasData;site:RecordEntry;target:RecordEntry}) {
 const {model}=useExploratory();if(!model)return <ModelStatus/>;
 const earth=model.sites.find(s=>s.id===site.id)!,planet=model.targets.find(t=>t.id===target.id)!;
 const score=modelScore(model,site.id,target.id);
 return <section aria-label="Eight scientific features"><SectionHeading eyebrow="Provisional model evidence" title="Eight scientific features" text={`${site.name} ↔ ${target.name}`}/>
  <div className="feature-comparisons">{data.features.map(f=>{
   const key=model.policy.feature_slots[f.id],a=earth.features[key],b=planet.features[key],similarity=score.similarities[key];
   return <article key={f.id} className="feature-evidence"><h3>{f.label.split(' (')[0]}</h3><div className="measurement-pair"><div><small>Earth · {site.name}</small><Reading feature={a}/></div><div><small>{target.body} · {target.name}</small><Reading feature={b}/></div></div>
    <p>{similarity===null?'Similarity unavailable':`Model similarity ${(similarity*100).toFixed(1)}% · ${score.strengthBands[key].toLowerCase()}`}</p>
    {similarity!==null&&<meter min={0} max={1} value={similarity} aria-label={`${f.label} provisional similarity`} style={{width:'100%'}}/>}
    <details><summary>Definition & provenance</summary><p>{f.limitations}</p><p>Feature concept: {f.definition_source}</p><p>Earth source: {a.source.path} {a.source.sheet} {a.source.cell} {a.source.claim}</p><p>Target source claim (unverified): {b.source.claim}</p><p>Raw input status: {a.status} / {b.status}. Normalization and target comparability are exploratory assumptions.</p></details>
   </article>;
  })}</div></section>;
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
              <p>Browse image · not a quantitative measurement.</p>
              <small>{candidateSite.images.photo.source}</small>
            </figcaption>
          </figure>
        )}
        {candidateSite?.images.dem && (
          <figure className="gallery-figure">
            <img src={candidateSite.images.dem.url} alt={candidateSite.images.dem.title} />
            <figcaption>
              <strong>{candidateSite.images.dem.title}</strong>
              <p>Browse image · not a quantitative measurement.</p>
              <small>{candidateSite.images.dem.source}</small>
            </figcaption>
          </figure>
        )}
        {candidateSite?.images.aster && (
          <figure className="gallery-figure">
            <img src={candidateSite.images.aster.url} alt={candidateSite.images.aster.title} />
            <figcaption>
              <strong>{candidateSite.images.aster.title}</strong>
              <p>Browse image · not a quantitative measurement.</p>
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
              <p>Target browse image · not a quantitative measurement.</p>
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
  openDetails,
}: {
  data: AtlasData;
  site: RecordEntry;
  target: RecordEntry;
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
        Geographic placement pending human review
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
          <Features data={data} site={site} target={target} />
        </>
      )}
      {tab === 'Mission' && (
        <>
          <h3>Hypothesis to test</h3>
          <p>
            {candidateSite?.primaryLithology
              ? `Provisional geological context: ${candidateSite.primaryLithology}. Its relevance to ${target.name} requires scientific review.`
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
      {tab === 'Sources' && <><WorkbookReadings siteIds={[site.id]} /><p>Measurement units, dates, extraction methods and confidence remain pending approval. Browse images are contextual and are not used to calculate features. Geological descriptions are legacy candidate context with source verification pending.</p><Sources data={data} /></>}
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
  category,
  onSelectCategory,
  compact = false,
  query,
  setQuery,
}: {
  data: AtlasData;
  activeId: string;
  select: (id: string) => void;
  category: string;
  onSelectCategory: (c: string) => void;
  compact?: boolean;
  query: string;
  setQuery: (query: string) => void;
}) {
  const visible = data.sites.filter(
    (s) =>
      (category === 'All' || s.group === category) &&
      matchesQuery(s, query),
  );
  return (
    <section className={compact ? 'catalogue compact' : 'catalogue'} aria-label="Earth site catalogue">
      <label className="selector-label">
        Search Earth sites
        <input
          type="search"
          value={query}
          placeholder="Site, region or geology…"
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="category-filters" aria-label="Site categories">
        {['All', ...categories].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            className={category === c ? 'active' : ''}
            onClick={() => onSelectCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="muted" role="status">
        {visible.length} of {data.sites.length} sites · Candidate register
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
              onSelectCategory('All');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

function RankingsView({
  data,
  target,
  targetId,
  setTargetId,
  onSelectSite,
}: {
  data: AtlasData;
  target: RecordEntry;
  targetId: string;
  setTargetId: (id: string) => void;
  onSelectSite: (id: string) => void;
}) {
  const {model}=useExploratory();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const siteEntries = data.sites.map((site, index) => ({
    site, candidateSite: CANDIDATE_SITES[site.id], registerNumber: index + 1, result:model ? modelScore(model,site.id,targetId) : null,
  }));

  const filtered = siteEntries.filter(({ site }) => {
    const matchesCat = category === 'All' || site.group === category;
    const matchesSearch = matchesQuery(site, query);
    return matchesCat && matchesSearch;
  });


  filtered.sort((a,b)=>{
    const left=a.result?.compositeScore??null,right=b.result?.compositeScore??null;
    if(left===null)return right===null?a.registerNumber-b.registerNumber:1;
    if(right===null)return -1;
    return right-left||a.registerNumber-b.registerNumber;
  });
  return (
    <section className="rankings-screen" aria-label="Earth site catalogue and rankings">
      <SectionHeading
        eyebrow="Planetary Analog Register"
        title="Earth Site Catalogue & Model Rankings"
        text={`Explore 12 candidate environments alongside ${target.name}. Sorted by indicative model score. Candidate inputs and target assumptions are subject to peer review.`}
      />

      {!model && <ModelStatus/>}
      {/* Target & Filter Bar */}
      <div className="rankings-controls-bar">
        <TargetSelect data={data} value={targetId} change={setTargetId} />

        <div className="rankings-filter-group">
          <div className="selector-label" role="group" aria-label="Filter by group">
            <span>Filter by group</span>
            <div className="category-filters" aria-label="Site categories">
              {['All', ...categories].map((c) => (
                <button
                  key={c}
                  aria-pressed={category === c}
                  className={category === c ? 'active' : ''}
                  onClick={() => setCategory(c)}
                >
                  {c}{' '}
                  {c === 'All'
                    ? `(${data.sites.length})`
                    : `(${data.sites.filter((s) => s.group === c).length})`}
                </button>
              ))}
            </div>
          </div>

          <label className="selector-label search-label">
            Search register
            <input
              type="search"
              value={query}
              placeholder="Search site, region, or geology…"
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Primary Figma Results Table */}
      <div className="results" role="region" aria-label="Analog catalogue rankings">
        <div className="results-head">
          <span>#</span>
          <span>Analog Site</span>
          <span>Geological Context & Lithology</span>
          <span>Indicative Match</span>
          <span>Action</span>
        </div>

        {filtered.map(({ site, candidateSite, result }, index) => {
          const rankNum = String(index + 1).padStart(2, '0');
          const thumb = candidateSite?.images.photo?.url ?? candidateSite?.images.dem?.url;

          return (
            <article className="result-row" key={site.id}>
              <span className="rank">{rankNum}</span>

              <div className="result-site">
                {thumb ? (
                  <img src={thumb} alt={site.name} className="result-thumb" />
                ) : (
                  <div className={`result-placeholder-thumb group-${site.group?.toLowerCase()}`}>
                    <span>{site.group?.[0]}</span>
                  </div>
                )}
                <span>
                  <b>{site.name}</b>
                  <small>
                    {site.region} · {site.group}
                  </small>
                </span>
              </div>

              <p>
                {candidateSite?.primaryLithology ?? 'Geological context pending review.'}<small className="context-status">Provisional context · source verification pending</small>
              </p>

              <div className="score pending-score candidate-score" aria-label="Indicative model score">
                <div style={{background:result?.compositeScore == null ? '#29475d' : `conic-gradient(#45c5e8 ${result.compositeScore*3.6}deg, #29475d 0deg)`}}><span>{result?.compositeScore == null ? '—' : result.compositeScore.toFixed(1)}</span></div><small>{result ? `${result.evaluatedFeatures}/8 evaluated` : 'Unavailable'}<br/>Provisional</small>
              </div>

              <button
                className="row-action text-button"
                onClick={() => onSelectSite(site.id)}
                aria-label={`Inspect ${site.name}`}
              >
                Inspect <Icon name="arrow" />
              </button>
            </article>
          );
        })}

        {!filtered.length && (
          <div className="notice" style={{ margin: 24 }}>
            <b>No candidate sites match the current filters</b>
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

        <div className="results-foot">
          {filtered.length} of {data.sites.length} sites shown · Indicative Model Score (Provisional Candidate Extraction — Subject to Peer Review). Coverage includes model assumptions; no reference percentile or scientific validation is claimed.
        </div>
      </div>
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
  const {model}=useExploratory();
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

      <ModelScore siteId={a.id} targetId={target.id}/><ModelScore siteId={b.id} targetId={target.id}/>
      <WorkbookReadings siteIds={[a.id,b.id]} />
      <div className="comparison-scroll" tabIndex={0} aria-label="Scrollable feature comparison">
        <table className="comparison-table">
          <caption>Exploratory candidate inputs · target values are model assumptions</caption>
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
                <td><Reading feature={model ? model?.sites.find(s=>s.id===a.id)?.features[model.policy.feature_slots[f.id]] : undefined}/></td>
                <td><Reading feature={model ? model?.sites.find(s=>s.id===b.id)?.features[model.policy.feature_slots[f.id]] : undefined}/></td>
                <td><Reading feature={model ? model?.targets.find(t=>t.id===target.id)?.features[model.policy.feature_slots[f.id]] : undefined}/></td>
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
  const {model}=useExploratory();
  const target = data.targets.find((t) => t.id === targetId)!;
  const site = data.sites.find((s) => s.id === siteId)!;
  const [body, setBody] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [siteQuery, setSiteQuery] = useState('');

  if (screen === 'explorer') {
    const explorerSites = data.sites.filter(
      (s) => (selectedCategory === 'All' || s.group === selectedCategory) && matchesQuery(s, siteQuery),
    );

    return (
      <main id="main-content" tabIndex={-1} className="atlas-explorer">
        <aside className="atlas-sidebar">
          <p className="eyebrow">Earth analog atlas</p>
          <TargetSelect data={data} value={targetId} change={setTargetId} />
          <Catalogue
            data={data}
            activeId={siteId}
            select={setSiteId}
            category={selectedCategory}
            onSelectCategory={setSelectedCategory}
            query={siteQuery}
            setQuery={setSiteQuery}
            compact
          />
        </aside>
        <div className="atlas-center">
          <WorldMap sites={explorerSites.map(s=>({...s,candidate_coordinates:model?.sites.find(m=>m.id===s.id)?.candidate_coordinates}))} activeSiteId={siteId} onSelectSite={setSiteId} />
          <div className="map-selection" role="status">
            Selected: <b>{site.name}</b> · {site.region} ({site.group}) · Provisional candidate placement; approval pending
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
  }

  return (
    <main id="main-content" tabIndex={-1} className="page mvp-page">
      {screen !== 'targets' && screen !== 'rankings' && (
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
            text="All four planned destinations remain available. Browse imagery provides context. Candidate inputs and model scores are provisional and subject to peer review."
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
                      <p>{t.coordinate_issue}</p>
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
        <RankingsView
          data={data}
          target={target}
          targetId={targetId}
          setTargetId={setTargetId}
          onSelectSite={(id) => {
            setSiteId(id);
            navigate('details');
          }}
        />
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
          <SitePanel key={site.id} data={data} site={site} target={target} />
        </>
      )}

      {screen === 'compare' && (
        <>
          <SectionHeading
            eyebrow="Side by side"
            title="Compare Earth candidates"
            text="Inspect feature availability for two Earth sites and the selected planetary target."
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
                TerraTwin is a research prototype for comparing selected Earth environments with Moon and Mars targets. This release makes the candidate register, source references and scientific data gaps visible.
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
                All 12 candidate sites are preserved. Candidate markers show provisional locations; the canonical approved coordinates remain pending. The basemap provides geographic context.
              </p>
            </article>
            <article>
              <span>02 / Evidence</span>
              <h2>Track what is known</h2>
              <p>
                Project workbook values remain provisional. NASA browse imagery is contextual and is never sampled as a measurement. Missing evidence remains explicit.
              </p>
            </article>
            <article>
              <span>03 / Method gate</span>
              <h2>Approve before calculating</h2>
              <p>
                The team authorized the legacy settings for exploratory use. Passing software tests verifies reproducibility; it does not establish scientifically valid normalization, categorical mappings or comparable target measurements.
              </p>
            </article>
            <article>
              <span>04 / Validation</span>
              <h2>Scientific comparison</h2>
              <p>
                Exploratory composite scores use workbook candidates and legacy target assumptions. Scientific validation still requires compatible measurements, documented methods and independent evidence.
              </p>
            </article>
          </div>
          <ModelMethod/>
          <Reality target={target} />
          <section className="data-gaps">
            <h2>Missing data and approvals</h2>
            <ul>
              {data.gaps.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            <p>
              Human approval is still required for candidate coordinates, source eligibility, target models and the complete comparison policy.
            </p>
          </section>
          <Sources data={data} />
        </>
      )}
    </main>
  );
}
