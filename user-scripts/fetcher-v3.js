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
const getFirstText = ele => ele.firstChild && ele.firstChild.nodeType === Node.TEXT_NODE && ele.firstChild.textContent;
const getLink = ele => ele && ele.getAttribute('href');
const getEmail = ele => { const href = getLink(ele); return href && href.startsWith('mailto:') && href.slice(7); };
const getItem = () => ({
  name: document.querySelector('.nHPWwd').innerHTML,
  author: getFirstText(document.querySelector('.Ry0mub')) || '',
  description: document.querySelector('.JqJiee').innerHTML,
  email: getEmail(document.querySelector('.ReVo3:nth-of-type(1)')),
  privacy: getLink(document.querySelector('.ReVo3:nth-of-type(2)')),
});
const getData = async () => {
  const elements = [].filter.call(document.querySelectorAll('a'), ele => ele.getAttribute('href').startsWith('services/'));
  const items = [];
  for (let i = 0; i < elements.length; i += 1) {
    const ele = elements[i];
    // if (ele.getAttribute('href') === 'services/a/uid/0000000cda5d5b9f?hl=ja') continue; // 404
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
    await sleep(1000);
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
