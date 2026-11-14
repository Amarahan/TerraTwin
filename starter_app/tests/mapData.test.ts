import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { approvedMapPosition, displayMapPosition, type MapSite } from '../src/mapData.ts';
const fixture: MapSite = {id:'test-only',name:'Test fixture',group:null,region:null,coordinates:[0,0],coordinate_status:'APPROVED'};
test('pending positions never become markers even with candidate numbers', () => {
  assert.equal(approvedMapPosition({...fixture,coordinate_status:'PENDING_HUMAN_REVIEW'}),null);
  assert.equal(approvedMapPosition({...fixture,coordinates:null}),null);
});
test('approved geographic zero is valid and invalid positions are rejected', () => {
  assert.deepEqual(approvedMapPosition(fixture),[0,0]);
  for (const coordinates of [[91,0],[0,181],[NaN,0],[0,Infinity]] as [number,number][]) assert.equal(approvedMapPosition({...fixture,coordinates}),null);
});
test('actual atlas has no approved marker positions', () => {
  const data=JSON.parse(readFileSync(new URL('../public/data/atlas.json',import.meta.url),'utf8'));
  assert.equal(data.sites.length,12);
  assert(data.sites.every((site: MapSite) => approvedMapPosition(site) === null));
});
test('presentation uses the validated exploratory helper rather than hardcoded normalization', () => {
  const view=readFileSync(new URL('../src/views.tsx',import.meta.url),'utf8');
  assert(!view.includes('calculateSiteScore'));
  assert(!view.includes('.normalized'));
  assert(!view.includes('score ?? 0'));
  assert(!view.includes('candidateSite.coordinates'));
});

test('explicit provisional display preserves canonical null and rejects bad candidate positions',()=>{
 const site:MapSite={...fixture,coordinates:null,coordinate_status:'PENDING_HUMAN_REVIEW',candidate_coordinates:[22,95]};
 assert.deepEqual(displayMapPosition(site),[22,95]);assert.equal(approvedMapPosition(site),null);assert.equal(site.coordinates,null);
 assert.equal(displayMapPosition({...site,candidate_coordinates:[91,95]}),null);
});
