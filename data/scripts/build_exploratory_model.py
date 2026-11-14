"""Build the team-authorized legacy exploratory model; never approves source science."""
from __future__ import annotations
import argparse,hashlib,json,math,subprocess
from pathlib import Path
try:
 from .publish_workbook_evidence import ROOT,LEGACY_ASSOCIATIONS,build as evidence_build
 from .scoring import calculate_site_score
except ImportError:
 from publish_workbook_evidence import ROOT,LEGACY_ASSOCIATIONS,build as evidence_build
 from scoring import calculate_site_score

def normalize(value,rule):
 if value is None:return None
 if rule['operation']=='category':return value
 if not isinstance(value,(int,float)) or isinstance(value,bool) or not math.isfinite(value):raise ValueError('Invalid numerical model input')
 op=rule['operation']; v=value
 if op=='divide':v=value/rule['divisor']
 elif op=='inverse_clamp_lower':v=max(0,1-value/rule['divisor'])
 elif op!='identity':raise ValueError('Unknown normalization')
 if not 0<=v<=1:raise ValueError('Model normalization outside [0,1]; no silent clipping')
 return v

def build(root=ROOT):
 legacy=json.loads(subprocess.check_output(['node','--experimental-strip-types',str(root/'data/scripts/snapshot_candidate_module.mjs')],cwd=root,encoding='utf-8'))
 evidence,_=evidence_build(root,legacy)
 policy=json.loads((root/'data/input/exploratory_policy.json').read_text(encoding='utf-8'))
 if policy['status']!='EXPLORATORY_TEAM_AUTHORIZED' or policy['scientifically_validated'] is not False:raise ValueError('Exploratory authorization required')
 records=[]
 for source in evidence['sites']:
  original=legacy['sites'][source['id']];features={}
  for key,claim in original['features'].items():
   variable=LEGACY_ASSOCIATIONS.get(key)
   reading=source['variables'].get(variable) if variable else None
   raw=reading['value'] if reading else claim['raw']
   unit=next((f['unit'] for f in evidence['fields'] if f['id']==variable),claim['unit'])
   status=('MISSING' if raw is None else 'WORKBOOK_CANDIDATE') if reading else 'MODEL_ASSUMPTION'
   features[key]={'raw':raw,'normalized':normalize(raw,policy['normalization'][key]),'unit':unit,'status':status,
    'source':reading['source'] if reading else {'path':'starter_app/src/candidateData.ts','claim':claim['sourceCitation']},
    'display':('No data' if raw is None else str(raw)), 'source_variable':variable}
  records.append({'id':source['id'],'name':source['name'],'features':features,'candidate_coordinates':original['coordinates'],'coordinate_status':'PENDING_HUMAN_REVIEW'})
 targets=[]
 for target in evidence['targets']:
  original=legacy['targets'][target['id']];features={}
  for key,claim in original['features'].items():
   features[key]={'raw':claim['raw'],'normalized':normalize(claim['raw'],policy['normalization'][key]),'unit':claim['unit'],'status':'MODEL_ASSUMPTION',
     'source':{'path':'starter_app/src/candidateData.ts','claim':claim['sourceCitation']},'display':str(claim['raw']),'source_variable':None}
  targets.append({'id':target['id'],'name':target['name'],'body':target['body'],'features':features})
 scores={}
 for target in targets:
  scores[target['id']]={}
  for site in records:
   result=calculate_site_score({k:v['normalized'] for k,v in site['features'].items()},{k:v['normalized'] for k,v in target['features'].items()},policy['weights'][target['body']],related_rock_groups=policy['related_rock_groups'],minimum_coverage=policy['minimum_weighted_coverage'])
   result['evaluated_features']=sum(v is not None for v in result['similarities'].values())
   scores[target['id']][site['id']]=result
 return {'schema_version':'exploratory-model-v1','register_sha256':evidence['register_sha256'],'scientifically_validated':False,'policy':policy,'sites':records,'targets':targets,'python_scores':scores,
  'input_hashes':{path:hashlib.sha256((root/path).read_bytes()).hexdigest() for path in ['data/input/exploratory_policy.json','starter_app/src/candidateData.ts','data/raw/mee_lay_master_project_data(1).xlsx']}}

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--check',action='store_true');args=p.parse_args();obj=build();text=json.dumps(obj,ensure_ascii=False,indent=2,allow_nan=False)+'\n'
 for path in [ROOT/'data/processed/exploratory_model.json',ROOT/'starter_app/public/data/exploratory-model.json']:
  if args.check:
   if not path.exists() or path.read_text(encoding='utf-8')!=text:raise ValueError(f'Stale model {path}')
  else:
   path.parent.mkdir(parents=True,exist_ok=True);temp=path.with_suffix('.json.tmp');temp.write_text(text,encoding='utf-8');temp.replace(path)
 print(f'{"Verified" if args.check else "Generated"} 48 provisional model comparisons; no scientific approval or spatial extraction. McMurdo NDVI remains null.')
if __name__=='__main__':main()
