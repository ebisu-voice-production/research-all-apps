const path = require('path');
const fs = require('fs');
const moment = require('moment');
const puppeteer = require('puppeteer');

const fetcher = require('../user-scripts/fetcher-v7.js');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(fetcher.TARGET);
  await page.evaluate(fetcher.scrollDown);
  const data = await page.evaluate(fetcher.getData);
  const date = moment().format('YYYY-MM-DD');
  const file = path.join(__dirname, '../data/test-' + date + '.json');
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  await browser.close();
})();
