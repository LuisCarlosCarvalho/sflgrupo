const axios = require('axios');
const cheerio = require('cheerio');

async function testMiTV() {
  const slug = 'globo-rj';
  const url = `https://mi.tv/br/canais/${slug}`;
  console.log(`Testando URL: ${url}`);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://mi.tv/br/programacao'
      },
      timeout: 10000
    });

    console.log(`Status: ${response.status}`);
    const $ = cheerio.load(response.data);
    const broadcasts = $('ul.broadcasts li');
    console.log(`Broadcasts encontrados: ${broadcasts.length}`);
    
    if (broadcasts.length === 0) {
      console.log("HTML recebido (primeiros 500 chars):", response.data.substring(0, 500));
    } else {
      broadcasts.each((i, el) => {
        const title = $(el).find('h2').text().trim();
        const time = $(el).find('.time').text().trim();
        console.log(`[${time}] ${title}`);
        if (i > 5) return false;
      });
    }
  } catch (err) {
    console.error("Erro no teste:", err.message);
  }
}

testMiTV();
