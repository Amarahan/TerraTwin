import {createRequire} from 'node:module';import {readFile,writeFile,mkdir} from 'node:fs/promises';import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.argv[2]);const model=JSON.parse(await readFile('public/data/exploratory-model.json','utf8'));const checks=[],errors=[];const out='../docs/qa/exploratory-model';await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('pageerror',e=>errors.push(e.message));
async function check(name,fn){await fn();checks.push(name);console.log('PASS',name);}
try{
 await page.goto('http://127.0.0.1:8443/#explorer',{waitUntil:'domcontentloaded'});await page.locator('.live-score-card h3').waitFor();
 await check('12 provisional markers and exact model label',async()=>{assert.equal(await page.locator('.leaflet-interactive[role=button]').count(),12);assert((await page.locator('.live-score-card').textContent()).includes(model.policy.score_label));assert((await page.locator('.map-workspace-toolbar').innerText()).includes('0 approved'));});
 await check('all 48 displayed scores agree with reproducible Python outputs',async()=>{
  for(const target of model.targets){await page.getByRole('combobox',{name:'Planetary target'}).selectOption(target.id);
   for(const site of model.sites){await page.locator('.site-list button').filter({has:page.getByText(site.name,{exact:true})}).click();const expected=model.python_scores[target.id][site.id];assert((await page.locator('.live-score-card h3').innerText()).includes(expected.composite_score.toFixed(2)));assert((await page.locator('.live-score-card').innerText()).includes(`${expected.evaluated_features}/8 features evaluated`));}
  }
 });
 await check('McMurdo has missing NDVI, seven meters and honest weighted coverage',async()=>{
  await page.locator('.site-list button').filter({has:page.getByText('McMurdo Dry Valleys',{exact:true})}).click();
  assert.equal(await page.locator('.feature-evidence meter').count(),7);
  assert((await page.locator('.live-score-card').innerText()).includes('95% weighted coverage'));
  const vegetation=page.locator('.feature-evidence').filter({has:page.getByRole('heading',{name:'Vegetation / bareness',exact:true})});assert((await vegetation.innerText()).includes('No data'));
  await page.locator('.selected-site').evaluate(e=>e.scrollTop=0);await page.waitForTimeout(900);await page.waitForFunction(()=>[...document.querySelectorAll('.leaflet-tile')].every(t=>t.complete&&t.naturalWidth>0));await page.screenshot({path:out+'/mcmurdo-explore.png'});
 });
 await check('provisional map marker selects its site',async()=>{
  await page.getByRole('button',{name:'Fit All Sites',exact:true}).click();await page.waitForTimeout(800);
  await page.getByRole('button',{name:'Select Atacama Desert (provisional location)',exact:true}).click();assert.equal(await page.locator('.selected-site>h2').innerText(),'Atacama Desert');
 });
 await check('failed and malformed model loads clear scores and markers; retry restores them',async()=>{
  let invalid=false;await page.route('**/data/exploratory-model.json',r=>invalid?r.fulfill({contentType:'application/json',body:'{}'}):r.fulfill({status:503,body:'Test failure'}));await page.reload({waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Retry candidate model'}).first().waitFor();
  assert.equal(await page.locator('.live-score-card').count(),0);assert.equal(await page.locator('.leaflet-interactive[role=button]').count(),0);
  invalid=true;await page.getByRole('button',{name:'Retry candidate model'}).first().click();await page.getByText('Exploratory model failed validation. Scores and candidate markers are unavailable.',{exact:true}).first().waitFor();
  await page.unroute('**/data/exploratory-model.json');await page.getByRole('button',{name:'Retry candidate model'}).first().click();await page.locator('.live-score-card h3').waitFor();assert.equal(await page.locator('.leaflet-interactive[role=button]').count(),12);
 });
 await check('model method is visible and no runtime exceptions',async()=>{await page.getByRole('navigation').getByRole('button',{name:'Method',exact:true}).click();await page.getByRole('heading',{name:'Exploratory method under review'}).waitFor();assert.deepEqual(errors,[]);});
}finally{await writeFile(out+'/results.json',JSON.stringify({checks,errors},null,2));await browser.close();}
