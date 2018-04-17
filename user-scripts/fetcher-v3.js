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
const getFirstText = ele => ele.firstChild && ele.firstChild.textContent;
const getItem = () => ({
  name: document.querySelector('.nHPWwd').innerHTML,
  author: getFirstText(document.querySelector('.Ry0mub')),
  description: document.querySelector('.JqJiee').innerHTML,
  email: document.querySelector('.ReVo3:nth-of-type(1)').innerHTML,
  privacy: document.querySelector('.ReVo3:nth-of-type(2)').getAttribute('href'),
});
const getData = async () => {
  const elements = [].filter.call(document.querySelectorAll('a'), ele => ele.getAttribute('href').startsWith('services/'));
  const items = [];
  for (const ele of elements) {
    ele.click();
    await sleep(2000);
    const item = getItem();
    item.id = ele.getAttribute('href');
    history.back();
    await sleep(1000);
    items.push(item);
  }
  return items;
};
const main = async () => {
  await scrollDown();
  console.log(JSON.stringify(await getData(), null, 2));
};

main();
