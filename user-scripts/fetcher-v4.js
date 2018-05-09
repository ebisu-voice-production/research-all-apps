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
const getItem = () => ({
  name: document.querySelector('.XIPoR.RfR9R').innerHTML,
  author: getFirstText(document.querySelector('.GCKci.CbqDob')) || '',
  description: document.querySelector('.JqJiee').innerHTML,
  email: document.querySelector('.UxXfse.CdFZQ').innerHTML,
  privacy: document.querySelector('.uyYuVb.oJeWuf').getAttribute('data-link'),
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
