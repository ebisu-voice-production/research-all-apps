const TARGET = 'https://assistant.google.com/explore/g/5?hl=ja';
if (location.href !== TARGET) location.href = TARGET;

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
  for (let i = 0; i < elements.length; ) {
    const ele = elements[i];
    ele.click();
    await sleep(2500);
    const item = getItem();
    item.id = ele.getAttribute('href');
    history.back();
    await sleep(1500);
    if (items.find(x => x.id === item.id)) {
      console.log('duplicated, redoing');
    } else {
      items.push(item);
      console.log(item);
      i += 1;
    }
  }
  return items;
};
const main = async () => {
  await scrollDown();
  console.log(JSON.stringify(await getData(), null, 2));
};

main();
