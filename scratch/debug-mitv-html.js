const axios = require('axios');

async function debugHTML() {
  const url = `https://mi.tv/br/async/channel/globo-rj/2026-04-29/-180`;
  const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'X-Requested-With': 'XMLHttpRequest' } });
  console.log(response.data.substring(0, 2000));
}

debugHTML();
