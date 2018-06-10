const moment = require('moment');
const request = require('request-promise-native');

const fetch = async (date = moment().format('YYYY-MM-DD')) => {
  const body = await request(`https://raw.githubusercontent.com/ebisu-voice-production/research-all-apps/master/data/${date}.json`);
  return JSON.parse(body);
};

const pickRandom = a => a[Math.floor(Math.random() * a.length)];

const main = async () => {
  const data = await fetch();
  const googleApps = data.filter(({ author }) => author.startsWith('Google'));
  const otherApps = data.filter(({ category }) => category !== 'スマートホーム');
  const googleApp = pickRandom(googleApps);
  const otherApp = pickRandom(otherApps);
  console.log('googleApp', googleApp.name);
  console.log('https://assistant.google.com/' + googleApp.id);
  console.log('otherApp', otherApp.name);
  console.log('https://assistant.google.com/' + otherApp.id);
};

main();
