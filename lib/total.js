const moment = require('moment');
const request = require('request-promise-native');

const fetch = async (date = moment().format('YYYY-MM-DD')) => {
  const body = await request(`https://raw.githubusercontent.com/ebisu-voice-production/research-all-apps/master/data/${date}.json`);
  return JSON.parse(body);
};

const main = async () => {
  const data = await fetch();
  const counts = { '総計': data.length };
  data.forEach(({ author }) => {
    counts[author] = (counts[author] || 0) + 1;
  });
  const names = Object.keys(counts);
  names.sort((a, b) => counts[b] - counts[a]);
  names.forEach((name) => {
    console.log(`"${name}", ${counts[name]}`);
  });
};

main();
