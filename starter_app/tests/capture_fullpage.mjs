import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1000));

try {
  const versionRes = await fetch('http://127.0.0.1:9222/json/version');
  const version = await versionRes.json();
  const wsUrl = version.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      const handler = (e) => {
        const data = JSON.parse(e.data);
        if (data.id === msgId) {
          ws.removeEventListener('message', handler);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  // Target 1: 1440px desktop
  const { targetId } = await send('Target.createTarget', { url: 'http://localhost:8443/#home' });
  const targetWs = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${targetId}`);
  await new Promise(r => targetWs.onopen = r);

  let tid = 1;
  function targetSend(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = tid++;
      const handler = (e) => {
        const data = JSON.parse(e.data);
        if (data.id === msgId) {
          targetWs.removeEventListener('message', handler);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
      targetWs.addEventListener('message', handler);
      targetWs.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await targetSend('Page.enable');
  await targetSend('DOM.enable');
  await targetSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await new Promise(r => setTimeout(r, 2000));

  // Hero view
  const { data: heroData } = await targetSend('Page.captureScreenshot', { format: 'png' });
  await writeFile('../docs/qa/landing-refinement/landing-1440px-hero.png', Buffer.from(heroData, 'base64'));

  // Scroll to featured section
  await targetSend('Runtime.evaluate', {
    expression: "document.querySelector('.featured-strip').scrollIntoView({ behavior: 'instant' });"
  });
  await new Promise(r => setTimeout(r, 800));
  const { data: featuredData } = await targetSend('Page.captureScreenshot', { format: 'png' });
  await writeFile('../docs/qa/landing-refinement/landing-1440px-featured.png', Buffer.from(featuredData, 'base64'));

  // Full page using captureBeyondViewport
  const { contentSize } = await targetSend('Page.getLayoutMetrics');
  const { data: fullData } = await targetSend('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: 1440,
      height: Math.ceil(contentSize.height),
      scale: 1
    }
  });
  await writeFile('../docs/qa/landing-refinement/landing-1440px-full.png', Buffer.from(fullData, 'base64'));
  console.log('Saved 1440px hero, featured, and full screenshots');

  // Target 2: 390px mobile
  const { targetId: mTargetId } = await send('Target.createTarget', { url: 'http://localhost:8443/#home' });
  const mTargetWs = new WebSocket(`ws://127.0.0.1:9222/devtools/page/${mTargetId}`);
  await new Promise(r => mTargetWs.onopen = r);

  let mid = 1;
  function mTargetSend(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = mid++;
      const handler = (e) => {
        const data = JSON.parse(e.data);
        if (data.id === msgId) {
          mTargetWs.removeEventListener('message', handler);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
      mTargetWs.addEventListener('message', handler);
      mTargetWs.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await mTargetSend('Page.enable');
  await mTargetSend('DOM.enable');
  await mTargetSend('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await new Promise(r => setTimeout(r, 2000));
  const { data: mHeroData } = await mTargetSend('Page.captureScreenshot', { format: 'png' });
  await writeFile('../docs/qa/landing-refinement/landing-390px-hero.png', Buffer.from(mHeroData, 'base64'));

  await mTargetSend('Runtime.evaluate', {
    expression: "document.querySelector('.featured-strip').scrollIntoView({ behavior: 'instant' });"
  });
  await new Promise(r => setTimeout(r, 800));
  const { data: mFeaturedData } = await mTargetSend('Page.captureScreenshot', { format: 'png' });
  await writeFile('../docs/qa/landing-refinement/landing-390px-featured.png', Buffer.from(mFeaturedData, 'base64'));

  const { contentSize: mContentSize } = await mTargetSend('Page.getLayoutMetrics');
  const { data: mFullData } = await mTargetSend('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: 390,
      height: Math.ceil(mContentSize.height),
      scale: 1
    }
  });
  await writeFile('../docs/qa/landing-refinement/landing-390px-full.png', Buffer.from(mFullData, 'base64'));
  console.log('Saved 390px hero, featured, and full screenshots');

  targetWs.close();
  mTargetWs.close();
  ws.close();
} finally {
  chrome.kill();
}
