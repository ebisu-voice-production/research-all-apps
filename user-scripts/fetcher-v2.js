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
const getData = () => JSON.stringify([].map.call(document.querySelectorAll('.GpVDee'), x => ({ id: x.getAttribute('href'), name: x.querySelector('.hzMTRd').innerHTML, author: x.querySelector('.OlFmif').innerHTML, description: x.querySelector('.fOsD6b').innerHTML })), null, 2);
const main = async () => {
  await scrollDown();
  console.log(getData());
};

main();
