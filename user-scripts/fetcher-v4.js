const TARGET = 'https://assistant.google.com/explore/g/5?hl=ja';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const scrollDown = async () => {
  let lastPos = 0;
  let pos = -1;
  while (pos !== lastPos) {
    document.getElementsByClassName('y3IDJd')[0].scrollTop = 999999999;
    await sleep(3000);
    lastPos = pos;
    pos = document.getElementsByClassName('y3IDJd')[0].scrollTop;
  }
};
const getHtml = ele => ele && ele.innerHTML || '';
const getLink = ele => ele && ele.getAttribute('href') || '';
const getContent = ele => ele && ele.getAttribute('content') || '';
const getItem = () => ({
  name: document.querySelector('.YtWsM.RfR9R').innerHTML,
  author: getHtml(document.querySelector('.lUcxUb.CbqDob')),
  description: document.querySelector('.IB9ccf').innerHTML,
  email: getHtml(document.querySelector('.Awug7 .rkJR4e.CdFZQ')),
  privacy: getLink(document.querySelector('.X63loe')),
  category: getHtml(document.querySelector('.HXoSSb .rkJR4e.CdFZQ')),
  ratingValue: getContent(document.querySelector('meta[itemprop="ratingValue"]')),
  ratingCount: getContent(document.querySelector('meta[itemprop="ratingCount"]')),
});
const getData = async () => {
  const elements = [].filter.call(document.querySelectorAll('a'), ele => ele.getAttribute('href').startsWith('services/'));
  const items = [];
  for (let i = 0; i < elements.length; i += 1) {
    const ele = elements[i];
    ele.click();
    let item = null;
    while(!item) {
      await sleep(1000);
      try {
        item = getItem();
      } catch(e) {
        console.log('error getting item, retrying:', e);
      }
    }
    item.id = ele.getAttribute('href');
    history.back();
    await sleep(1500);
    if (items.find(x => x.name === item.name)) {
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
