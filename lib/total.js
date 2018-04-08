const moment = require('moemnt');
const request = require('request-promise-native');

const fetch = async (date = moment().format('YYYY-MM-DD')) => {
  const body = await request(`https://raw.githubusercontent.com/ebisu-voice-production/research-all-apps/master/data/${date}.json`);
  return JSON.parse(body);
};

const main = async () => {
  const data = await fetch();
  console.log('total:', data.length);
};

main();
