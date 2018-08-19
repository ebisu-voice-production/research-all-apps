const TARGET = 'https://assistant.google.com/explore/g/5?hl=ja';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const scrollDown = async () => {
  let lastPos = 0;
  let pos = -1;
  while (pos !== lastPos) {
    document.getElementsByClassName('y3IDJd')[0].scrollTop = 999999999;
    lastPos = pos;
    for (let i = 0; i < 5; i += 1) {
      await sleep(1000);                  
      pos = document.getElementsByClassName('y3IDJd')[0].scrollTop;
      if (pos !== lastPos) break;
    }
  }
};
const getEle = xpath => document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null ).iterateNext();
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
const reset = () => {
  fwdWaitMs = 500;
  bwdWaitMs = 500;
};
const getData = async () => {
  const elements = [].filter.call(document.querySelectorAll('div[jsaction="click:KjsqPd"]'), ele => ele.getAttribute('data-link').startsWith('services/'));
  const items = [];
  for (let i = 0; i < elements.length; i += 1) {
    const ele = elements[i];
    // if (ele.getAttribute('data-link') === 'services/a/uid/00000053dffc688d?hl=ja') continue;
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
        if (fwdWaitMs > 30 * 1000) fwdWaitMs = 30 * 1000;
      }
    }
    item.id = ele.getAttribute('data-link');
    history.back();
    await sleep(bwdWaitMs);
    while (document.querySelector('.SSPGKf').className !== 'SSPGKf') {
      console.log('waiting for going backward');
      await sleep(100);
      bwdWaitMs += 100;
      if (bwdWaitMs > 30 * 1000) bwsWaitMs = 30 * 1000;
    }
    if (items.find(x => x.name === item.name && x.author === item.author && x.description === item.description)) {
      console.log('duplicated, redoing');
      i -= 1;
    } else {
      items.push(item);
      console.log(item);
    }
  }
  return items;
};
const main = async () => {
  await scrollDown();
  console.log(JSON.stringify(await getData(), null, 2));
};

if (location.href === TARGET) main(); else location.href = TARGET;
