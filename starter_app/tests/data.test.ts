import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseAtlas } from '../src/data.ts';
const input = () => JSON.parse(readFileSync(new URL('../public/data/atlas.json', import.meta.url), 'utf8'));
test('complete register preserves all pending entries and eight missing values each', () => {
  const d=parseAtlas(input()); assert.equal(d.sites.length,12); assert.equal(d.targets.length,4);
  assert.deepEqual(d.targets.map(t=>t.name),['Shackleton Crater Rim','Malapert Massif','Jezero Crater','Meridiani Planum']);
  assert.deepEqual(['Featured','Benchmark','Control'].map(g=>d.sites.filter(s=>s.group===g).length),[4,5,3]);
  for (const r of [...d.sites,...d.targets]) { assert.equal(r.coordinates,null); assert.equal(r.score,null); assert.equal(Object.keys(r.measurements).length,8); }
});
test('rejects null, empty and unsupported contracts',()=>{ for(const v of [null,{},[],{...input(),schema_version:'unknown'}]) assert.throws(()=>parseAtlas(v)); });
test('rejects omitted and duplicate locations',()=>{const d=input();d.sites.pop();assert.throws(()=>parseAtlas(d));const e=input();e.sites[1].id=e.sites[0].id;assert.throws(()=>parseAtlas(e));});
test('rejects fabricated scores, zero-filled measurements and coordinates',()=>{
  for(const mutate of [(d:ReturnType<typeof input>)=>d.sites[0].score=85,(d:ReturnType<typeof input>)=>d.sites[0].coordinates={latitude:0,longitude:0},(d:ReturnType<typeof input>)=>d.sites[0].measurements['feature-1'].value=0]){const d=input();mutate(d);assert.throws(()=>parseAtlas(d));}
});
test('rejects missing feature rows and unsafe source URLs',()=>{const d=input();delete d.targets[0].measurements['feature-1'];assert.throws(()=>parseAtlas(d));const e=input();e.sources[0].url='javascript:alert(1)';assert.throws(()=>parseAtlas(e));});
