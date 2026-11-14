import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import type {AtlasData} from './data';
import {parseExploratoryModel,modelScore,type ExploratoryModel,type ModelFeature} from './exploratoryData';
const Context=createContext<{model:ExploratoryModel|null;error:string;retry:()=>void}>({model:null,error:'',retry:()=>{}});
export const useExploratory=()=>useContext(Context);
export function ExploratoryProvider({atlas,children}:{atlas:AtlasData;children:ReactNode}){
 const [model,setModel]=useState<ExploratoryModel|null>(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 useEffect(()=>{const abort=new AbortController();setModel(null);setError('');
 fetch(`${import.meta.env.BASE_URL}data/exploratory-model.json`,{signal:abort.signal,cache:'no-store'})
 .then(r=>{if(!r.ok)throw new Error(`Exploratory model request failed (${r.status}).`);return r.json();}).then(x=>parseExploratoryModel(x,atlas)).then(setModel)
 .catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Model unavailable.');});return()=>abort.abort();},[atlas,attempt]);
 return <Context.Provider value={{model,error,retry:()=>setAttempt(n=>n+1)}}>{children}</Context.Provider>;
}
export function ModelStatus(){const{error,retry}=useExploratory();return error?<div role="alert" className="notice"><p>{error}</p><button className="secondary" onClick={retry}>Retry candidate model</button></div>:<p role="status">Loading provisional candidate model…</p>;}
export function ModelScore({siteId,targetId}:{siteId?:string;targetId?:string}){
 const{model}=useExploratory();if(!model)return <ModelStatus/>;
 if(!siteId||!targetId)return <div className="notice score-notice"><b>Exploratory candidate model</b><p>Select an Earth site and target to inspect provisional scores. Model assumptions and candidate inputs remain subject to peer review.</p></div>;
 const score=modelScore(model,siteId,targetId);
 return <div className="live-score-card"><span className="eyebrow">{model.policy.score_label}</span><div className="score-header"><h3>{score.compositeScore===null?'Unavailable':score.compositeScore.toFixed(2)}{score.compositeScore!==null&&<small> / 100</small>}</h3></div>
 <p>{score.evaluatedFeatures}/8 features evaluated · {(score.weightedCoverage*100).toFixed(0)}% weighted coverage</p><p className="score-summary">Coverage counts model inputs, including assumptions. It is not verified measurement coverage. Missing features are omitted without renormalizing weights.</p>{score.statusReason&&<p>{score.statusReason}</p>}</div>;
}
export function Reading({feature}:{feature:ModelFeature|undefined}){return <><strong>{feature?.raw??'No data'}</strong>{feature&&<><small> {feature.raw!==null?feature.unit:''}</small><br/><small>{feature.status==='MODEL_ASSUMPTION'?'Unverified model assumption':feature.status==='MISSING'?'Missing source value':'Workbook candidate · pending validation'}</small></>}</>;}
export function ModelMethod(){const{model}=useExploratory();if(!model)return <ModelStatus/>;
 return <section className="data-gaps"><h2>Exploratory method under review</h2><p>{model.policy.score_label}</p><p>Numeric similarity = 1 − |Earth normalized − target normalized|. Composite = 100 × sum(weight × available similarity).</p><p>{model.policy.missing_policy}</p>
 <div className="comparison-scroll"><table className="comparison-table"><caption>Legacy model settings — exploratory, not scientific validation</caption><thead><tr><th>Feature</th><th>Normalization</th><th>Moon weight</th><th>Mars weight</th></tr></thead><tbody>{Object.entries(model.policy.normalization).map(([key,rule])=><tr key={key}><th>{key}</th><td>{rule.operation==='divide'?`value / ${rule.divisor}`:rule.operation==='inverse_clamp_lower'?`max(0, 1 − rainfall / ${rule.divisor})`:rule.operation}</td><td>{model.policy.weights.Moon[key]}</td><td>{model.policy.weights.Mars[key]}</td></tr>)}</tbody></table></div>
 <p>Rock similarity: same category 1; within a listed related group 0.5; otherwise 0. Ice indices are legacy model assumptions. Feature meters: Strong ≥ 0.75, Partial ≥ 0.40, otherwise Weak.</p><ul>{model.policy.related_rock_groups.map((g,i)=><li key={i}>{g.join(', ')}</li>)}</ul><p>{model.policy.tie_rule}</p><ul>{model.policy.limitations.map(item=><li key={item}>{item}</li>)}</ul></section>;
}
