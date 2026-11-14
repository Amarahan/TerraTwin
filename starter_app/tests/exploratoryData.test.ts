import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseExploratoryModel,modelScore} from '../src/exploratoryData.ts';
import {parseAtlas} from '../src/data.ts';
const raw=JSON.parse(readFileSync(new URL('../public/data/exploratory-model.json',import.meta.url),'utf8'));
const atlas=parseAtlas(JSON.parse(readFileSync(new URL('../public/data/atlas.json',import.meta.url),'utf8')));
const model=parseExploratoryModel(raw,atlas);
test('all 48 real candidate comparisons match Python scores and contributions',()=>{
 for(const target of model.targets)for(const site of model.sites){
  const actual=modelScore(model,site.id,target.id),expected=raw.python_scores[target.id][site.id];
  assert.equal(actual.compositeScore,expected.composite_score);
  assert.equal(actual.weightedCoverage,expected.weighted_coverage);
  assert.equal(actual.evaluatedFeatures,expected.evaluated_features);
  assert.deepEqual(actual.contributions,expected.contributions);
 }
});
test('McMurdo retains seven evaluated features with no NDVI contribution',()=>{
 for(const target of model.targets){const s=modelScore(model,'mcmurdo-dry-valleys',target.id);assert.equal(s.evaluatedFeatures,7);assert.equal(s.similarities.vegetation,null);assert.equal(s.weightedCoverage,target.body==='Mars'?.95:.97);}
});
test('false scientific approval, coordinate approval and NDVI substitution fail validation',()=>{
 assert.throws(()=>parseExploratoryModel({...raw,scientifically_validated:true},atlas));
 const invalid=structuredClone(raw);invalid.sites.find((s:{id:string})=>s.id==='mcmurdo-dry-valleys').features.vegetation.raw=0;assert.throws(()=>parseExploratoryModel(invalid,atlas));
 const coords=structuredClone(raw);coords.sites[0].coordinate_status='APPROVED';assert.throws(()=>parseExploratoryModel(coords,atlas));
});
test('invalid model inputs and weights cannot produce a displayable score',()=>{
 const invalid=structuredClone(raw);invalid.sites[0].features.slope.normalized=Infinity;assert.throws(()=>parseExploratoryModel(invalid,atlas));
 const weights=structuredClone(raw);weights.policy.weights.Moon.slope=-1;assert.throws(()=>parseExploratoryModel(weights,atlas));
 assert.throws(()=>parseExploratoryModel({...raw,register_sha256:'old'},atlas));
});
