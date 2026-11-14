import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.argv[2]);
const data=JSON.parse(await readFile('public/data/workbook-evidence.json','utf8'));
const out='../docs/qa/workbook-evidence';await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
async function check(name,fn){await fn();checks.push(name);console.log('PASS',name);}
try{
 await page.goto('http://127.0.0.1:8443/#details',{waitUntil:'domcontentloaded'});
 await check('source panel loads exact worksheet readings and provenance',async()=>{
  await page.getByRole('button',{name:'Sources',exact:true}).click();await page.locator('.workbook-readings summary').click();
  await page.getByText('Original source fields and cells',{exact:true}).waitFor();
  const rows=page.locator('.workbook-readings tbody tr');assert.equal(await rows.count(),10);
  for(let i=0;i<data.fields.length;i++){const key=data.fields[i].id;const value=data.sites[0].variables[key];assert((await rows.nth(i).innerText()).includes(value.original_text??'Missing workbook cell'));assert((await rows.nth(i).innerText()).includes(value.source.cell));}
 });
 await check('side-by-side source values update with both Earth selectors and preserve missing NDVI',async()=>{
  await page.getByRole('navigation').getByRole('button',{name:'Compare',exact:true}).click();
  await page.locator('.workbook-readings summary').click();
  await page.getByRole('combobox',{name:'First Earth site'}).selectOption('mcmurdo-dry-valleys');
  await page.getByRole('combobox',{name:'Second Earth site'}).selectOption('atacama-desert');
  const row=page.locator('.workbook-readings tbody tr').filter({has:page.getByRole('rowheader',{name:'ndvi index',exact:true})});
  assert((await row.innerText()).includes('Missing workbook cell'));assert((await row.innerText()).includes('Site data!K11'));
  assert((await page.locator('.workbook-readings').innerText()).includes('0.0978'));
  await page.locator('.workbook-readings').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/comparison.png'});
 });
 await check('failed or malformed evidence never falls back to stale readings; retry recovers',async()=>{
  let invalid=false;await page.route('**/data/workbook-evidence.json',r=>invalid?r.fulfill({contentType:'application/json',body:'{}'}):r.fulfill({status:503,body:'Test failure'}));
  await page.reload({waitUntil:'domcontentloaded'});await page.locator('.workbook-readings summary').click();await page.getByRole('alert').waitFor();
  assert.equal(await page.locator('.workbook-readings tbody tr').count(),0);
  invalid=true;await page.getByRole('button',{name:'Retry workbook evidence'}).click();await page.getByText('Workbook evidence failed validation. No candidate readings are displayed.',{exact:true}).waitFor();
  await page.unroute('**/data/workbook-evidence.json');await page.getByRole('button',{name:'Retry workbook evidence'}).click();await page.getByText('Original source fields and cells',{exact:true}).waitFor();
  assert.equal(await page.locator('.workbook-readings tbody tr').count(),10);
 });
 await check('390px source-table content stays within existing scroll container',async()=>{
  await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('.workbook-readings').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/mobile.png'});
 });
 await check('no runtime exceptions',async()=>assert.deepEqual(errors,[]));
}finally{await writeFile(out+'/results.json',JSON.stringify({checks,errors},null,2));await browser.close();}
