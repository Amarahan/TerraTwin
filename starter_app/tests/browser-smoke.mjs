// Run with node tests/browser-smoke.mjs <path-to-existing-playwright-package>.
// Uses installed Edge and an isolated profile; does not install dependencies.
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.argv[2] || 'playwright');
const base = process.env.TERRATWIN_TEST_URL || 'http://127.0.0.1:8443/';
const out = path.resolve('../docs/qa');
await mkdir(out, { recursive:true });
const data=JSON.parse(await readFile('public/data/atlas.json','utf8'));
const checks=[], errors=[], consoleErrors=[], failedRequests=[];
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text());});
page.on('requestfailed',r=>failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
async function check(name,fn){await fn();checks.push(name);console.log('PASS',name);}
async function nav(name){const menu=page.getByRole('button',{name:'Toggle menu',exact:true});if(await menu.isVisible()) await menu.click();await page.getByRole('navigation').getByRole('button',{name,exact:true}).click();}
async function fits(){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
try {
 await page.goto(base);await page.getByRole('button',{name:'Start Exploring',exact:true}).waitFor();
 await check('six desktop navigation sections',async()=>{for(const name of ['Mission','Targets','Explore','Catalogue','Compare','Method']){await nav(name);await page.getByRole('main').waitFor();await fits();}});
 await check('four target cards and body filters',async()=>{await nav('Targets');await page.getByRole('button',{name:'Moon',exact:true}).click();assert.equal(await page.getByRole('button',{name:/^Explore /}).count(),2);await page.getByRole('button',{name:'Mars',exact:true}).click();assert.equal(await page.getByRole('button',{name:/^Explore /}).count(),2);await page.getByRole('button',{name:'All',exact:true}).click();for(const t of data.targets){await page.getByRole('button',{name:`Explore ${t.name}`,exact:true}).click();assert.equal(await page.getByRole('combobox',{name:'Planetary target'}).inputValue(),t.id);await nav('Targets');}});
 await page.screenshot({path:path.join(out,'desktop-targets.png'),fullPage:true});
 await check('all 12 sites synchronize list, detail and map status',async()=>{await nav('Explore');for(const s of data.sites){await page.getByRole('button',{name:new RegExp('^'+s.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+' ')}).click();assert.equal(await page.getByRole('region',{name:'Selected site details'}).getByRole('heading').first().innerText(),s.name);assert((await page.getByRole('status').last().innerText()).includes(s.name));}assert.equal(await page.locator('.leaflet-marker-icon').count(),0);});
 await check('search, categories and empty-state recovery',async()=>{for(const [name,count] of [['Featured',4],['Benchmark',5],['Control',3],['All',12]]){await page.getByRole('button',{name,exact:true}).click();assert.equal(await page.getByRole('button',{name:/Geographic placement pending review/}).count(),count);}await page.getByRole('searchbox').fill('Kawah');assert.equal(await page.getByRole('button',{name:/Geographic placement pending review/}).count(),1);await page.getByRole('searchbox').fill('no-such-location');await page.getByRole('button',{name:'Clear filters'}).click();assert.equal(await page.getByRole('button',{name:/Geographic placement pending review/}).count(),12);});
 await check('map zoom and reset',async()=>{await page.getByRole('button',{name:'Zoom in',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.leaflet-control-zoom-out')?.getAttribute('aria-disabled')==='false');await page.getByRole('button',{name:'Reset View'}).click();});
 await page.screenshot({path:path.join(out,'desktop-atlas.png'),fullPage:false});
 await check('site detail tabs, eight features and missing values',async()=>{await page.getByRole('button',{name:'Open site details'}).click();const panel=page.getByRole('region',{name:'Selected site details'});for(const name of ['Mission','Limits','Sources','Fit']){await panel.getByRole('button',{name,exact:true}).click();}const features=page.getByRole('region',{name:'Eight scientific features'});assert.equal(await features.getByRole('article').count(),8);assert.equal(await features.locator('meter').count(),8);await features.locator('summary').first().click();await features.getByText(/Target source claim \(unverified\):/).first().waitFor({state:'visible'});});
 await check('comparison and all target selector options',async()=>{await page.getByRole('button',{name:'Compare Earth sites'}).click();for(const label of ['First Earth site','Second Earth site'])for(const s of data.sites)await page.getByRole('combobox',{name:label}).selectOption(s.id);assert((await page.getByRole('status').innerText()).includes('same site'));for(const t of data.targets){await page.getByRole('combobox',{name:'Planetary target'}).selectOption(t.id);assert.equal(await page.getByRole('columnheader').last().innerText(),t.name);}assert.equal(await page.getByRole('cell',{name:'No data',exact:true}).count(),0);assert((await page.getByRole('main').innerText()).includes('Unverified model assumption'));});
 await check('methodology, limits and source references',async()=>{await nav('Method');await page.getByRole('heading',{name:'Mission Reality / Earth Analog limitations',exact:true}).waitFor();const links=page.getByRole('link',{name:'Open source reference ↗',exact:true});assert.equal(await links.count(),data.sources.length);for(const link of await links.all())assert.equal(new URL(await link.getAttribute('href')).protocol,'https:');});
 await check('mobile 390px navigation and layout',async()=>{await page.setViewportSize({width:390,height:844});for(const name of ['Mission','Targets','Explore','Catalogue','Compare','Method']){await nav(name);await fits();assert.equal(await page.getByRole('button',{name:'Toggle menu'}).getAttribute('aria-expanded'),'false');}});
 await check('mobile target, site and feature panels',async()=>{await nav('Targets');await page.getByRole('button',{name:'Explore Jezero Crater',exact:true}).click();await page.getByRole('combobox',{name:'Planetary target'}).selectOption(data.targets[1].id);await page.getByRole('searchbox').fill('Kawah');await page.getByRole('button',{name:/^Kawah Ijen Indonesia/}).click();await page.getByRole('button',{name:'Open site details'}).click();await fits();assert.equal(await page.getByRole('region',{name:'Eight scientific features'}).getByRole('article').count(),8);});
 await page.screenshot({path:path.join(out,'mobile-details.png'),fullPage:true});
 await check('failed fetch, invalid JSON contract, and retry recovery',async()=>{let mode='http';await page.route('**/data/atlas.json',route=>mode==='http'?route.fulfill({status:503,body:'Intentional smoke-test failure'}):route.fulfill({status:200,contentType:'application/json',body:'{"schema_version":"invalid"}'}));await page.reload();await page.getByRole('alert').waitFor();assert((await page.getByRole('alert').innerText()).includes('503'));mode='json';await page.getByRole('button',{name:'Retry data load'}).click();await page.getByText('The atlas data failed validation. No scientific records have been displayed.',{exact:true}).waitFor();assert.equal(await page.getByRole('region',{name:'Selected site details'}).count(),0);await page.unroute('**/data/atlas.json');await page.getByRole('button',{name:'Retry data load'}).click();await page.getByRole('main').waitFor();await page.getByRole('combobox',{name:'Planetary target'}).waitFor();});
 await check('no runtime exceptions',async()=>assert.deepEqual(errors,[]));
} finally {
 await writeFile(path.join(out,'browser-smoke-results.json'),JSON.stringify({base,checks,passed:checks.length,runtimeErrors:errors,consoleErrors,failedRequests,note:'HTTP 503 console errors in the failure fixture are intentional; source destinations were checked as links, not all opened.'},null,2));
 await browser.close();
}
