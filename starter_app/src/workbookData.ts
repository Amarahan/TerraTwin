export type WorkbookReading = {
  value: number | null; status: 'MISSING' | 'PENDING_REVIEW'; original_text: string | null;
  source: {path: string; sha256: string; sheet: string; cell: string; header_cell: string};
};
export type WorkbookEvidence = {
  schema_version: 'workbook-evidence-v1'; eligible_for_scoring: false; register_sha256: string;
  source_statement: string; warnings: string[];
  fields: {id:string; label:string; unit:string; unit_status:string}[];
  sites: {id:string; name:string; variables:Record<string,WorkbookReading>}[];
};
const object=(x:unknown):x is Record<string,unknown>=>!!x && typeof x==='object' && !Array.isArray(x);
const hasStrings=(v:Record<string,unknown>,keys:string[])=>keys.every(k=>typeof v[k]==='string');
export function parseWorkbookEvidence(input:unknown, registerHash:string, siteIds:string[]):WorkbookEvidence {
  const fail=():never=>{throw new Error('Workbook evidence failed validation. No candidate readings are displayed.');};
  if(!object(input)||input.schema_version!=='workbook-evidence-v1'||input.eligible_for_scoring!==false||input.register_sha256!==registerHash||
    typeof input.source_statement!=='string'||!Array.isArray(input.warnings)||!input.warnings.every(x=>typeof x==='string')||
    !Array.isArray(input.fields)||input.fields.length!==10||!Array.isArray(input.sites)||input.sites.length!==12) return fail();
  const fields=new Set<string>();
  for(const f of input.fields){
    if(!object(f)||typeof f.id!=='string'||fields.has(f.id)||typeof f.label!=='string'||typeof f.unit!=='string'||f.unit_status!=='SOURCE_HEADER_INTERPRETATION')return fail();
    fields.add(f.id);
  }
  const seen=new Set<string>();
  for(const site of input.sites){
    if(!object(site)||typeof site.id!=='string'||!siteIds.includes(site.id)||seen.has(site.id)||typeof site.name!=='string'||!object(site.variables)||Object.keys(site.variables).length!==10)return fail();
    seen.add(site.id);
    for(const field of fields){
      const v=site.variables[field];
      if(!object(v)||!object(v.source)||!(v.value===null||(typeof v.value==='number'&&Number.isFinite(v.value)))||
        v.status!==(v.value===null?'MISSING':'PENDING_REVIEW')||
        !(v.original_text===null||typeof v.original_text==='string')||
        !hasStrings(v.source,['path','sha256','sheet','cell','header_cell']))return fail();
      if(!/^[a-f0-9]{64}$/.test(String(v.source.sha256))||!/^data\/raw\//.test(String(v.source.path))||
        !/^[A-Z]+[1-9]\d*$/.test(String(v.source.cell))||!fields.has(field))return fail();
      if(v.value!==null&&(v.original_text===null||v.original_text.trim()===''||Number(v.original_text)!==v.value))return fail();
    }
  }
  if(seen.size!==siteIds.length)return fail();
  return input as unknown as WorkbookEvidence;
}
