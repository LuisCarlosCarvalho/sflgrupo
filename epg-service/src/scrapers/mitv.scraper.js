const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeMiTV() {
  const url = "https://mi.tv/br/programacao";
  console.log(`[Scraper HTML] Sincronizando com nova estrutura #channels: ${url}`);

  try {
    const { data } = await axios.get(url, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      timeout: 20000
    });

    const $ = cheerio.load(data);
    const canais = [];

    // Nova estrutura identificada: #channels .channel
    $("#channels .channel").each((i, el) => {
      const channelHeader = $(el).find('a.c');
      if (channelHeader.length === 0) return;

      const nome = channelHeader.find('h3').text().trim() || channelHeader.attr('title');
      const logo = channelHeader.find('img').attr('src');
      const slug = channelHeader.attr('href')?.split('/').pop();

      const programas = [];
      // Programas estão em ul.broadcasts li
      $(el).find('ul.broadcasts li').each((j, li) => {
        const title = $(li).find('.title').text().trim();
        const time = $(li).find('.time').text().trim();
        const isLive = $(li).hasClass('live');

        if (title && time) {
          programas.push({ title, time, isLive });
        }
      });

      if (nome && programas.length > 0) {
        canais.push({ nome, logo, slug, programas });
      }
    });

    console.log(`[Scraper HTML] Sucesso! ${canais.length} canais com grade completa encontrados.`);
    return canais;
  } catch (err) {
    console.error(`[Scraper HTML] Erro Crítico: ${err.message}`);
    throw err;
  }
}

module.exports = { scrapeMiTV };
