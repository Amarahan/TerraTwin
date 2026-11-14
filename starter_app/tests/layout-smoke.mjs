import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const base=process.env.TERRATWIN_TEST_URL||'http://127.0.0.1:8443/';
const out='../docs/qa/final-layout';await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage();
const checks=[],exceptions=[],requests=[],tileResponses=[],consoleErrors=[];
page.on('pageerror',e=>exceptions.push(e.message));
page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text().replace(/token=[^'\s&]+/g,'token=[redacted]'));});
page.on('requestfailed',r=>requests.push({url:r.url(),error:r.failure()?.errorText}));
page.on('response',r=>{if(r.url().includes('tile.openstreetmap.org'))tileResponses.push({url:r.url(),status:r.status()});});
async function check(name,fn){await fn();checks.push(name);console.log('PASS',name);}
async function shot(name){await page.waitForTimeout(250);await page.screenshot({path:`${out}/${name}.png`,fullPage:false});}
async function fits(){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
async function open(hash){await page.goto(base+hash,{waitUntil:'domcontentloaded'});}
async function tilesLoaded(){await page.waitForFunction(()=>{const tiles=[...document.querySelectorAll('.leaflet-tile')];return tiles.length>0&&tiles.every(t=>t.complete&&t.naturalWidth>0);});}
let failure=null;
try{
 for(const [width,height] of [[1440,900],[1280,720]]){
  await page.setViewportSize({width,height});await open('#explorer');await page.locator('.map-workspace-toolbar').waitFor();await page.waitForFunction(()=>document.querySelectorAll('.leaflet-interactive[role=button]').length===12);await page.evaluate(()=>document.fonts.ready);await tilesLoaded();
  await check(`${width}: bounded three-column workspace, tiles and independent scrolling`,async()=>{
   await fits();
   const toolbar=await page.locator('.map-workspace-toolbar').boundingBox(),map=await page.locator('.leaflet-atlas').boundingBox();
   assert(map.height>250);assert(toolbar.y+toolbar.height<=map.y+1);
   assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1));
   await shot(`explore-${width}-initial`);
   await page.locator('.site-list').hover();await page.mouse.wheel(0,700);
   await page.locator('.selected-site').hover();await page.mouse.wheel(0,900);
   await page.waitForFunction(()=>document.querySelector('.selected-site').scrollTop>0 && document.querySelector('.site-list').scrollTop>0);
   assert.deepEqual(await page.locator('.leaflet-atlas').boundingBox(),map);
   assert(await page.getByRole('searchbox').isVisible());
   assert.equal(await page.evaluate(()=>scrollY),0);
   await shot(`explore-${width}-scrolled`);
  });
 }
 await check('single feature presentation and labelled exploratory model',async()=>{
  assert.equal(await page.locator('.feature-evidence').count(),8);
  assert.equal(await page.locator('.candidate-table,.compact-features').count(),0);assert.equal(await page.locator('.leaflet-interactive[role="button"]').count(),12);
  assert(await page.getByRole('button',{name:'Fit All Sites'}).isEnabled());
  const text=await page.locator('main').textContent();assert(!text.includes('Coordinates:'));assert(text.includes('Subject to Peer Review'));assert(text.includes('0 approved'));
 });
 await check('Myanmar focus and reset navigate the basemap',async()=>{
  await page.getByRole('button',{name:'Focus Myanmar'}).click();await page.waitForTimeout(900);
  await page.waitForFunction(()=>[...document.querySelectorAll('.leaflet-tile')].some(t=>t.src.includes('/7/97/56.png')));
  await page.getByRole('button',{name:'Reset View'}).click();await page.waitForTimeout(900);await tilesLoaded();
  assert(await page.locator('.leaflet-tile').evaluateAll(tiles=>tiles.some(t=>t.src.includes('/2/'))));
 });
 await check('Explore search and category update list and map candidate counts together',async()=>{
  await page.getByRole('button',{name:'Benchmark',exact:true}).click();await page.getByRole('searchbox').fill('Chile');
  assert.equal(await page.locator('.site-list button').count(),1);
  assert((await page.locator('.map-workspace-toolbar').innerText()).includes('1 candidates'));
  await page.getByRole('searchbox').fill('no-such-site');await page.getByRole('button',{name:'Clear filters'}).click();
  assert.equal(await page.locator('.site-list button').count(),12);
 });
 await page.setViewportSize({width:1440,height:900});await open('#rankings');await page.locator('.result-row').first().waitFor();
 await check('one catalogue, 12 records and provisional scores',async()=>{
  assert.equal(await page.locator('.results').count(),1);assert.equal(await page.locator('.result-row').count(),12);
  assert.equal(await page.locator('.pending-score').count(),12);await fits();await shot('catalogue-desktop');
 });
 await check('combined group, geography and geology filters; provisional score display',async()=>{
  for(const [group,count] of [['Featured',4],['Benchmark',5],['Control',3],['All',12]]){
   await page.getByRole('button',{name:`${group} (${count})`,exact:true}).click();assert.equal(await page.locator('.result-row').count(),count);
  }
  await page.getByRole('button',{name:'Benchmark (5)'}).click();await page.getByRole('searchbox').fill('Chile');assert.equal(await page.locator('.result-row').count(),1);
  assert((await page.locator('.result-row').innerText()).includes('Atacama'));assert.equal(await page.locator('.candidate-score').count(),1);await shot('catalogue-filtered');
  await page.getByRole('searchbox').fill('zz-no-match');assert.equal(await page.locator('.result-row').count(),0);
  await page.getByRole('button',{name:'Clear filters'}).click();assert.equal(await page.locator('.result-row').count(),12);
  await page.getByRole('searchbox').fill('basalt');assert(await page.locator('.result-row').count()>0);await page.getByRole('searchbox').fill('');
 });
 await check('four target choices persist; every Inspect action opens its own site',async()=>{
  const data=JSON.parse(await readFile('public/data/atlas.json','utf8'));
  for(const target of data.targets){await page.getByRole('combobox',{name:'Planetary target'}).selectOption(target.id);await page.getByRole('navigation').getByRole('button',{name:'Explore',exact:true}).click();assert.equal(await page.getByRole('combobox',{name:'Planetary target'}).inputValue(),target.id);await page.getByRole('navigation').getByRole('button',{name:'Catalogue',exact:true}).click();}
  for(const site of data.sites){await page.getByRole('button',{name:`Inspect ${site.name}`,exact:true}).click();assert.equal(await page.locator('.selected-site>h2').innerText(),site.name);await page.getByRole('navigation').getByRole('button',{name:'Catalogue',exact:true}).click();}
 });
 await page.setViewportSize({width:1280,height:720});await fits();await shot('catalogue-1280');
 await page.setViewportSize({width:390,height:844});await open('#explorer');await page.locator('.leaflet-atlas').waitFor();await tilesLoaded();
 await check('390px stacked Explore, readable Catalogue cards and no horizontal overflow',async()=>{
  await fits();assert((await page.locator('.leaflet-atlas').boundingBox()).height>=300);
  await page.locator('.atlas-center').scrollIntoViewIfNeeded();await shot('explore-mobile');
  await open('#rankings');await page.locator('.result-row').first().waitFor();await fits();
  assert(!(await page.locator('.results-head').isVisible()));assert.equal(await page.locator('.result-row').count(),12);await shot('catalogue-mobile');
  await page.locator('.result-row').last().scrollIntoViewIfNeeded();await fits();await shot('catalogue-mobile-last');
 });
 await page.setViewportSize({width:1280,height:720});
 await check('tile failure is visible and retry recovers actual tiles',async()=>{
  await page.route('https://tile.openstreetmap.org/**',r=>r.abort());await open('#explorer');
  await page.getByRole('button',{name:'Retry tiles'}).waitFor();await page.unroute('https://tile.openstreetmap.org/**');
  await page.getByRole('button',{name:'Retry tiles'}).click();await tilesLoaded();assert.equal(await page.getByRole('button',{name:'Retry tiles'}).count(),0);
 });
 await check('synthetic fixture: approved marker/list sync, keyboard selection, fit and filter',async()=>{
  await page.route('**/__map_fixture',async r=>{
    const response=await page.request.get(base);
    const html=(await response.text()).replace(/<script type="module" src="\/src\/main\.tsx[^"]*"><\/script>/,
      '<script type="module">import {mount} from "/tests/map-fixture.tsx"; mount();</script>');
    assert(html.includes('import {mount}'));
    await r.fulfill({contentType:'text/html',body:html});
  });
  await page.goto(new URL('__map_fixture',base).href,{waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:'TEST FIXTURE ONLY'}).waitFor();
  const markers=page.locator('.leaflet-interactive[role="button"]');assert.equal(await markers.count(),2);
  assert.equal(await page.getByRole('button',{name:'Select Synthetic pending',exact:true}).count(),0);
  await page.getByRole('button',{name:'Select Synthetic B',exact:true}).click();assert.equal(await page.locator('output').innerText(),'test-b');
  await page.getByRole('button',{name:'Select list A',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Select Synthetic A',exact:true}).getAttribute('aria-pressed'),'true');
  await page.getByRole('button',{name:'Fit All Sites'}).click();await page.waitForTimeout(900);
  await page.getByRole('button',{name:'Select Synthetic B',exact:true}).focus();await page.keyboard.press('Enter');assert.equal(await page.locator('output').innerText(),'test-b');
  await page.getByRole('button',{name:'Toggle filter'}).click();assert.equal(await markers.count(),1);
 });
 await check('no runtime exceptions',async()=>assert.deepEqual(exceptions,[]));
}catch(e){failure=String(e);throw e;}finally{
 await writeFile(`${out}/results.json`,JSON.stringify({base,checks,failure,exceptions,requests,tileResponses,consoleErrors,notes:'Tile failure fixture intentionally aborts requests. Production register contains no approved positions; marker interactions tested only with isolated synthetic fixture.'},null,2));await browser.close();
}
