import { useEffect, useState } from 'react';
import { parseAtlas, type AtlasData } from './data';
import { Header, Home, type Screen } from './Shell';
import { AtlasViews } from './views';
const screens: Screen[] = ['home','targets','explorer','rankings','details','compare','about'];
function route(): Screen { const s = location.hash.slice(1) as Screen; return screens.includes(s) ? s : 'home'; }
export default function App() {
  const [data, setData] = useState<AtlasData | null>(null);
  const [error, setError] = useState('');
  const [attempt, retry] = useState(0);
  const [screen, setScreen] = useState<Screen>(route);
  const [targetId, setTargetId] = useState('');
  const [siteId, setSiteId] = useState('');
  useEffect(() => {
    const controller = new AbortController(); setData(null); setError('');
    fetch(`${import.meta.env.BASE_URL}data/atlas.json`, { signal: controller.signal, cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error(`Atlas request failed (${r.status}).`); return r.json(); })
      .then(parseAtlas).then(d => { setData(d); setTargetId(v => d.targets.some(t => t.id === v) ? v : d.targets[0].id); setSiteId(v => d.sites.some(s => s.id === v) ? v : d.sites[0].id); })
      .catch(e => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Unable to load atlas data.'); });
    return () => controller.abort();
  }, [attempt]);
  useEffect(() => { const change = () => { setScreen(route()); window.scrollTo(0,0); }; window.addEventListener('hashchange',change); return () => window.removeEventListener('hashchange',change); }, []);
  const navigate = (next: Screen) => { setScreen(next); location.hash = next; window.scrollTo(0,0); };
  return <div className="app-shell"><a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById('main-content')?.focus();}}>Skip to content</a><Header screen={screen} navigate={navigate}/>
    {!data ? <main id="main-content" tabIndex={-1} className="page loading-state"><h1>{error ? 'Atlas unavailable' : 'Loading the atlas…'}</h1><p role={error ? 'alert' : 'status'}>{error || 'Reading the provisional register and data status.'}</p>{error && <button className="primary" onClick={()=>retry(v=>v+1)}>Retry data load</button>}</main> : <><div className="integrity-banner">TerraTwin Research Prototype · Candidate Evidence & Planetary Model Comparison</div>{screen==='home' ? <Home data={data} navigate={navigate} selectSite={id=>{setSiteId(id);navigate('details');}}/> : <AtlasViews data={data} screen={screen} navigate={navigate} targetId={targetId} setTargetId={setTargetId} siteId={siteId} setSiteId={setSiteId}/>}</>}
    <footer><span>TerraTwin</span><p>Planetary Analog Atlas · Evidence before similarity</p><small>Provisional candidate register · Indicative model scores subject to review</small></footer></div>;
}
