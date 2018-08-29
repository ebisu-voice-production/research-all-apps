const moment = require('moment');
const request = require('request-promise-native');

const RINDO_APPS = ['オリジナルペットのサポート'];
const patchForRindo = data => {
  data.forEach(item => {
    if (item.author === '恵比寿ボイスプロダクション' && RINDO_APPS.includes(item.name)) {
      item.author = '恵比寿ボイスプロダクション (RINDO)';
    }
  });
};

const fetch = async (date = moment().format('YYYY-MM-DD')) => {
  const body = await request(`https://raw.githubusercontent.com/ebisu-voice-production/research-all-apps/master/data/${date}.json`);
  return JSON.parse(body);
};

const main = async () => {
  const data = await fetch();
  patchForRindo(data);
  const counts = { '総計': 0 };
  data.forEach(({ author, devices = [] }) => {
    if (devices.includes("Google Home")) {
      counts['総計'] += 1;
      counts[author] = (counts[author] || 0) + 1;
    }
  });
  const names = Object.keys(counts);
  names.sort((a, b) => counts[b] - counts[a]);
  names.forEach((name) => {
    console.log(`"${name}", ${counts[name]}`);
  });
};

main();
