import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {parseWorkbookEvidence,type WorkbookEvidence} from './workbookData';

type State={data:WorkbookEvidence|null;error:string;retry:()=>void};
const Context=createContext<State>({data:null,error:'',retry:()=>{}});
export function WorkbookEvidenceProvider({registerHash,siteIds,children}:{registerHash:string;siteIds:string[];children:ReactNode}){
 const [data,setData]=useState<WorkbookEvidence|null>(null),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 const idKey=siteIds.join('|');
 useEffect(()=>{
  const abort=new AbortController();setData(null);setError('');
  fetch(`${import.meta.env.BASE_URL}data/workbook-evidence.json`,{signal:abort.signal,cache:'no-store'})
   .then(r=>{if(!r.ok)throw new Error(`Workbook evidence request failed (${r.status}).`);return r.json();})
   .then(x=>parseWorkbookEvidence(x,registerHash,idKey.split('|'))).then(setData)
   .catch(e=>{if(!abort.signal.aborted)setError(e instanceof Error?e.message:'Workbook evidence unavailable.');});
  return ()=>abort.abort();
 },[registerHash,idKey,attempt]);
 return <Context.Provider value={{data,error,retry:()=>setAttempt(n=>n+1)}}>{children}</Context.Provider>;
}
export function WorkbookReadings({siteIds}:{siteIds:string[]}){
 const {data,error,retry}=useContext(Context);
 return <details className="workbook-readings"><summary>Workbook source readings · pending validation</summary>
  <p>Original workbook values, not approved comparison features. They are excluded from scores. Rainfall periods, extraction methods and target comparability remain unverified.</p>
  {error?<div role="alert"><p>{error}</p><button className="secondary" onClick={retry}>Retry workbook evidence</button></div>:!data?<p role="status">Loading workbook evidence…</p>:<>
   <p>{data.source_statement}</p>
   <div className="comparison-scroll" tabIndex={0} aria-label="Workbook source readings">
    <table className="comparison-table"><caption>Original source fields and cells</caption><thead><tr><th>Workbook field / unit</th>{siteIds.map((id,index)=><th key={`${id}-${index}`}>{data.sites.find(s=>s.id===id)?.name}</th>)}</tr></thead>
     <tbody>{data.fields.map(field=><tr key={field.id}><th>{field.label}<br/><small>{field.unit}</small></th>{siteIds.map((id,index)=>{
       const reading=data.sites.find(s=>s.id===id)!.variables[field.id];
       return <td key={`${id}-${index}`}><strong>{reading.value===null?'Missing workbook cell':reading.original_text}</strong><br/><small>{reading.status==='MISSING'?'Missing':'Candidate · pending validation'}<br/>{reading.source.sheet}!{reading.source.cell}</small></td>;
     })}</tr>)}</tbody>
    </table>
   </div>
   <p>Source file: {data.sites[0].variables[data.fields[0].id].source.path}</p>
   <p className="checksum">Workbook SHA-256: {data.sites[0].variables[data.fields[0].id].source.sha256}</p>
   <p>Units follow the source headers; matching a source cell does not validate the original extraction.</p>
  </>}
 </details>;
}
