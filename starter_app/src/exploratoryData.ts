import {calculateSiteScore,validateWeights,type ScoreResult} from './scoring.ts';
import type {AtlasData} from './data';
export type ModelFeature={raw:number|string|null;normalized:number|string|null;unit:string;status:'MISSING'|'WORKBOOK_CANDIDATE'|'MODEL_ASSUMPTION';display:string;source:{path:string;cell?:string;sheet?:string;sha256?:string;claim?:string};};
export type ModelSite={id:string;name:string;features:Record<string,ModelFeature>;candidate_coordinates?:[number,number];coordinate_status?:string;body?:'Moon'|'Mars'};
export type ExploratoryModel={schema_version:'exploratory-model-v1';scientifically_validated:false;register_sha256:string;sites:ModelSite[];targets:ModelSite[];policy:{status:'EXPLORATORY_TEAM_AUTHORIZED';scientifically_validated:false;score_label:string;feature_slots:Record<string,string>;weights:Record<string,Record<string,number>>;related_rock_groups:string[][];minimum_weighted_coverage:number;missing_policy:string;limitations:string[];normalization:Record<string,{operation:string;divisor?:number}>;tie_rule:string;};};
const obj=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function parseExploratoryModel(v:unknown,atlas:AtlasData):ExploratoryModel{
 const fail=():never=>{throw new Error('Exploratory model failed validation. Scores and candidate markers are unavailable.');};
 if(!obj(v)||v.schema_version!=='exploratory-model-v1'||v.scientifically_validated!==false||v.register_sha256!==atlas.register_sha256||!obj(v.policy)||v.policy.status!=='EXPLORATORY_TEAM_AUTHORIZED'||v.policy.scientifically_validated!==false||!obj(v.policy.weights)||!obj(v.policy.feature_slots)||!Array.isArray(v.sites)||v.sites.length!==12||!Array.isArray(v.targets)||v.targets.length!==4)return fail();
 const policy=v.policy;
 if(typeof policy.score_label!=='string'||typeof policy.missing_policy!=='string'||typeof policy.tie_rule!=='string'||!Array.isArray(policy.limitations)||!policy.limitations.every(x=>typeof x==='string')||!obj(policy.normalization)||!Array.isArray(policy.related_rock_groups)||!policy.related_rock_groups.every(g=>Array.isArray(g)&&g.every(x=>typeof x==='string'))||typeof policy.minimum_weighted_coverage!=='number'||!Number.isFinite(policy.minimum_weighted_coverage)||policy.minimum_weighted_coverage<=0||policy.minimum_weighted_coverage>1)return fail();
 const slots=policy.feature_slots as Record<string,unknown>;
 if(Object.keys(slots).length!==8||atlas.features.some(f=>typeof slots[f.id]!=='string')||new Set(Object.values(slots)).size!==8)return fail();
 const keys=Object.values(slots) as string[];
 const rules=policy.normalization as Record<string,unknown>;
 if(Object.keys(rules).length!==8)return fail();
 for(const key of keys){const rule=rules[key];if(!obj(rule)||!['divide','inverse_clamp_lower','identity','category'].includes(String(rule.operation)))return fail();if(['divide','inverse_clamp_lower'].includes(String(rule.operation))&&(typeof rule.divisor!=='number'||!Number.isFinite(rule.divisor)||rule.divisor<=0))return fail();}
 const profiles=policy.weights as Record<string,unknown>;
 for(const body of ['Moon','Mars']){const weights=profiles[body];if(!obj(weights)||Object.keys(weights).length!==8||keys.some(k=>typeof weights[k]!=='number'))return fail();validateWeights(weights as Record<string,number>);}
 const expected=new Set([...atlas.sites,...atlas.targets].map(r=>r.id)),seen=new Set<string>();
 for(const [records,earth] of [[v.sites,true],[v.targets,false]] as const)for(const r of records){
  if(!obj(r)||typeof r.id!=='string'||!expected.has(r.id)||seen.has(r.id)||typeof r.name!=='string'||!obj(r.features)||Object.keys(r.features).length!==8)return fail();seen.add(r.id);
  if(earth){if(!atlas.sites.some(s=>s.id===r.id)||r.coordinate_status!=='PENDING_HUMAN_REVIEW'||!Array.isArray(r.candidate_coordinates)||r.candidate_coordinates.length!==2||!r.candidate_coordinates.every(x=>typeof x==='number'&&Number.isFinite(x))||Math.abs(r.candidate_coordinates[0])>90||Math.abs(r.candidate_coordinates[1])>180)return fail();}
  else if(!atlas.targets.some(t=>t.id===r.id&&t.body===r.body))return fail();
  for(const key of keys){const f=r.features[key];if(!obj(f)||typeof f.unit!=='string'||typeof f.display!=='string'||!obj(f.source)||typeof f.source.path!=='string'||!['MISSING','WORKBOOK_CANDIDATE','MODEL_ASSUMPTION'].includes(String(f.status)))return fail();
   if(f.raw===null){if(f.normalized!==null||f.status!=='MISSING')return fail();}
   else{if(f.status==='MISSING'||f.normalized===null||!(typeof f.raw==='string'||typeof f.raw==='number'&&Number.isFinite(f.raw)))return fail();if(key==='rock_mineral'){if(typeof f.normalized!=='string')return fail();}else if(typeof f.normalized!=='number'||!Number.isFinite(f.normalized)||f.normalized<0||f.normalized>1)return fail();}
   if(f.status==='WORKBOOK_CANDIDATE'&&(typeof f.source.sha256!=='string'||typeof f.source.cell!=='string'||typeof f.source.sheet!=='string'))return fail();
  }
 }
 // The known source blank cannot be reintroduced as a plausible zero.
 const mcmurdo=v.sites.find(s=>s.id==='mcmurdo-dry-valleys');if(mcmurdo?.features.vegetation.raw!==null)return fail();
 return v as unknown as ExploratoryModel;
}
export function modelScore(model:ExploratoryModel,siteId:string,targetId:string,customWeights?:Record<string,number>):ScoreResult&{evaluatedFeatures:number}{
 const site=model.sites.find(s=>s.id===siteId),target=model.targets.find(s=>s.id===targetId);
 if(!site||!target?.body)throw new Error('Unknown model site or target');
 const values=(record:ModelSite)=>Object.fromEntries(Object.entries(record.features).map(([key,feature])=>[key,feature.normalized]));
 if(customWeights)validateWeights(customWeights);
 const weights=customWeights??model.policy.weights[target.body];
 const result=calculateSiteScore(values(site),values(target),weights,{relatedRockGroups:model.policy.related_rock_groups,minimumCoverage:model.policy.minimum_weighted_coverage});
 return {...result,evaluatedFeatures:Object.values(result.similarities).filter(v=>v!==null).length};
}
