const axios = require('axios');
const cheerio = require('cheerio');

async function testSherdog() {
  try {
    const { data } = await axios.get('https://www.sherdog.com/events');
    const $ = cheerio.load(data);
    const events = [];
    
    $('#recentfights_tab .event').each((i, el) => {
        if(i > 3) return; // limit to 4
        const dateRaw = $(el).find('meta[itemprop="startDate"]').attr('content');
        const name = $(el).find('span[itemprop="name"]').text().trim();
        const url = $(el).find('a[itemprop="url"]').attr('href');
        events.push({ dateRaw, name, url });
    });
    console.log("SHERDOG:", events);
  } catch (e) {
    console.error("SHERDOG ERR:", e.message);
  }
}

async function testGE() {
  try {
    const { data } = await axios.get('https://ge.globo.com/futebol/brasileirao-serie-a/');
    const $ = cheerio.load(data);
    const script = $('script').filter((i, el) => {
        return $(el).html().includes('const ag =') || $(el).html().includes('window.__INITIAL_STATE__');
    }).html();
    console.log("GE GLOBALS:", script ? script.substring(0, 100) : "NO SCRIPT FOUND");
  } catch (e) {
    console.error("GE ERR:", e.message);
  }
}

async function testUFC() {
  try {
    const { data } = await axios.get('https://www.ufc.com/events');
    const $ = cheerio.load(data);
    const events = [];
    $('.c-card-event--result').each((i, el) => {
        if(i>2) return;
        const main = $(el).find('.c-card-event--result__headline').text().trim().replace(/\s+/g, ' ');
        events.push(main);
    });
    console.log("UFC:", events);
  } catch (e) {
    console.error("UFC ERR:", e.message);
  }
}

testSherdog();
testGE();
testUFC();
