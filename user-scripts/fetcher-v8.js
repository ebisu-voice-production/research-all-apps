// const TARGET = 'https://assistant.google.com/explore/g/5?hl=ja';
const TARGET = 'https://assistant.google.com/explore/g/9?hl=ja-JP';

const scrollDown = async () => {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  let lastPos = 0;
  let pos = -1;
  while (pos !== lastPos) {
    document.getElementsByClassName('y3IDJd')[0].scrollTop = 999999999;
    lastPos = pos;
    for (let i = 0; i < 10; i += 1) {
      window.resizeBy(-1, 0);
      await sleep(3000);
      pos = document.getElementsByClassName('y3IDJd')[0].scrollTop;
      if (pos !== lastPos) break;
    }
  }
};

const getData = async () => {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const arrayFromIte = ite => { const a = []; let x; while (x = ite.iterateNext()) a.push(x); return a; }
  const getEle = xpath => document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
  const getEleAll = xpath => arrayFromIte(document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null));
  const getHtml = ele => ele && ele.innerHTML || '';
  const getList = lst => lst && [].map.call(lst, getHtml);
  const getLink = ele => ele && ele.getAttribute('href') || '';
  const getContent = ele => ele && ele.getAttribute('content') || '';
  const getItem = () => ({
    name: document.querySelector('.YtWsM.RfR9R').innerHTML,
    author: getHtml(document.querySelector('.lUcxUb.CbqDob')),
    description: document.querySelector('.IB9ccf').innerHTML,
    privacy: getLink(document.querySelector('.X63loe a')),
    category: getHtml(getEle('//div[text()="詳細"]/..').querySelector('img + div')),
    devices: getList(getEle('//div[text()="使用可能なデバイス"]/..').querySelectorAll('img + div')),
    ratingValue: getContent(document.querySelector('meta[itemprop="ratingValue"]')),
    ratingCount: getContent(document.querySelector('meta[itemprop="ratingCount"]')),
  });
  let fwdWaitMs = 500;
  let bwdWaitMs = 500;

  const elements = [].filter.call(getEleAll('//a'), ele => ele.getAttribute('href').startsWith('services/'));
  console.log('number of elements:', elements.length);
  const items = [];
  for (let i = 0; i < elements.length; i += 1) {
    const ele = elements[i];
    if (ele.getAttribute('href') === 'services/a/uid/00000041cb62690a') continue;
    if (ele.getAttribute('href') === 'services/a/uid/000000f6a22aa5c1') continue;
    if (ele.getAttribute('href') === 'services/a/uid/0000007769153fa0') continue;
    if (ele.getAttribute('href') === 'services/a/uid/000000b65204a3dc') continue;
    if (ele.getAttribute('href') === 'services/a/uid/000000897c9cdcb0') continue;
    if (ele.getAttribute('href') === 'services/a/uid/00000042024f0e53') continue;
    if (ele.getAttribute('href') === 'services/a/uid/0000008030e15402') continue;
    if (ele.getAttribute('href') === 'services/a/uid/0000007f4f6ee210') continue;
    if (ele.getAttribute('href') === 'services/a/uid/000000efd55c8201') continue;
    if (ele.getAttribute('href') === 'services/a/uid/0000009ed2b22a07') continue;
    ele.click();
    let item = null;
    await sleep(fwdWaitMs);
    while (!item) {
      try {
        item = getItem();
      } catch(e) {
        console.log('error getting item, retrying:', e);
      }
      if (!item) {
        console.log('waiting for going forward');
        await sleep(100);
        fwdWaitMs += 100;
        if (fwdWaitMs > 5 * 1000) fwdWaitMs = 5 * 1000;
      }
    }
    item.id = ele.getAttribute('href');
    history.back();
    await sleep(bwdWaitMs);
    while (document.querySelector('.SSPGKf').className !== 'SSPGKf') {
      console.log('waiting for going backward ' + item.id);
      await sleep(100);
      bwdWaitMs += 100;
      if (bwdWaitMs > 5 * 1000) bwsWaitMs = 5 * 1000;
    }
    if (items.find(x => x.name === item.name && x.author === item.author && x.description === item.description)) {
      console.log('duplicated, redoing ' + item.id);
      i -= 1;
    } else {
      items.push(item);
      console.log('processed ' + item.id, item);
    }
  }
  return items;
};

const main = async () => {
  await scrollDown();
  console.log(JSON.stringify(await getData(), null, 2));
};

if (typeof module == 'undefined') {
  if (location.href === TARGET) {
    main();
  } else {
    location.href = TARGET;
  }
} else {
  module.exports = { TARGET, scrollDown, getData };
}
