const axios = require('axios');
const cheerio = require('cheerio');

async function testMiTVAsync() {
  const slug = 'globo-rj';
  const date = new Date().toISOString().split('T')[0];
  const url = `https://mi.tv/br/async/channel/${slug}/${date}/-180`;
  console.log(`Testando API Async: ${url}`);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 10000
    });

    console.log(`Status: ${response.status}`);
    const $ = cheerio.load(response.data);
    const programs = $('li');
    console.log(`Programas encontrados: ${programs.length}`);
    
    programs.slice(0, 5).each((i, el) => {
      const time = $(el).find('.time').text().trim();
      const title = $(el).find('h2').text().trim();
      console.log(`[${time}] ${title}`);
    });

  } catch (err) {
    console.error("Erro no teste async:", err.message);
  }
}

testMiTVAsync();
