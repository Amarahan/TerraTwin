import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseWorkbookEvidence} from '../src/workbookData.ts';
const source=JSON.parse(readFileSync(new URL('../public/data/workbook-evidence.json',import.meta.url),'utf8'));
const atlas=JSON.parse(readFileSync(new URL('../public/data/atlas.json',import.meta.url),'utf8'));
const parse=(data:unknown)=>parseWorkbookEvidence(data,atlas.register_sha256,atlas.sites.map((s:{id:string})=>s.id));
test('published evidence preserves 116 candidates and four missing cells',()=>{
 const data=parse(source), readings=data.sites.flatMap(s=>Object.values(s.variables));
 assert.equal(readings.filter(v=>v.value!==null).length,116);
 assert.equal(readings.filter(v=>v.value===null).length,4);
});
test('unapproved NDVI zero substitution and false scoring approval are rejected',()=>{
 const changed=structuredClone(source);changed.sites.find((s:{id:string})=>s.id==='mcmurdo-dry-valleys').variables.ndvi.value=0;
 assert.throws(()=>parse(changed));
 assert.throws(()=>parse({...source,eligible_for_scoring:true}));
});
test('wrong register, malformed values and missing provenance fail closed',()=>{
 assert.throws(()=>parse({...source,register_sha256:'wrong'}));
 for(const value of [NaN,Infinity,'42']){const changed=structuredClone(source);changed.sites[0].variables.slope_deg.value=value;assert.throws(()=>parse(changed));}
 const changed=structuredClone(source);delete changed.sites[0].variables.slope_deg.source;assert.throws(()=>parse(changed));
});
test('dropped records, duplicate fields and incompatible source text are rejected',()=>{
 assert.throws(()=>parse({...source,sites:source.sites.slice(1)}));
 const changed=structuredClone(source);changed.fields[1]=changed.fields[0];assert.throws(()=>parse(changed));
 const altered=structuredClone(source);altered.sites[0].variables.slope_deg.original_text='999';assert.throws(()=>parse(altered));
});
