const {chromium}=require('C:/Users/felip/AppData/Local/Programs/Python/Python313/Lib/site-packages/playwright/driver/package');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage();
 const url=file=>pathToFileURL(path.resolve(file)).href;
 for(const width of [1440,1100,1024,768,390,320]){
  await page.setViewportSize({width,height:850});
  await page.goto(url('index.html')); await page.waitForTimeout(1500);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width>1050){
   assert.ok(await page.locator('.navbar a').first().isVisible());
   const box=await page.locator('.navbar').boundingBox(); assert.ok(box.x+box.width<=width);
   if(width===1440)await page.screenshot({path:'.nav-desktop.png'});
  }else{
   assert.equal(await page.locator('.navbar').evaluate(el=>el.inert),true);
   await page.locator('.menu-icon').click();
   assert.equal(await page.locator('.menu-icon').getAttribute('aria-expanded'),'true');
   await page.waitForTimeout(300);
   assert.equal(await page.locator('.menu-icon span').first().evaluate(el=>getComputedStyle(el).opacity),'1');
   const box=await page.locator('.navbar').boundingBox(); assert.ok(box.x>=0&&box.x+box.width<=width);
   assert.ok(await page.locator('.navbar a[href="contato.html"]').isVisible());
   if(width===390)await page.screenshot({path:'.nav-mobile.png'});
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('.menu-icon').getAttribute('aria-expanded'),'false');
   assert.equal(await page.locator('.menu-icon').evaluate(el=>el===document.activeElement),true);
   await page.locator('.menu-icon').click();
   await page.mouse.click(width/2,800);
   assert.equal(await page.locator('.menu-icon').getAttribute('aria-expanded'),'false');
  }
  console.log('Layout/menu OK:',width);
 }
 await page.locator('.menu-icon').click();
 await page.setViewportSize({width:1440,height:850});
 await page.waitForTimeout(100);
 assert.equal(await page.locator('.navbar').evaluate(el=>el.inert),false);
 assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('nav-open')),false);
 for(const file of ['projetos.html','formacoes.html','experiencia.html','depoimentos.html','contato.html']){
  await page.goto(url(file));
  assert.equal(await page.locator('.nav-brand').count(),1);
  assert.equal(await page.locator('.navbar a[aria-current="page"]').getAttribute('href'),file);
  console.log('Shared navigation OK:',file);
 }
 await page.setViewportSize({width:390,height:500});
 await page.locator('.menu-icon').click();
 await page.locator('.navbar a[href="projetos.html"]').click();
 await page.waitForURL('**/projetos.html');
 console.log('Resize reset, short viewport and page navigation OK');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
