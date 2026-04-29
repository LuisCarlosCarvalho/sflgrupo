const puppeteer = require("puppeteer");

async function scrapeMiTVPuppeteer() {
  console.log("[Scraper Puppeteer] Processando nova estrutura #channels...");
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

    await page.goto("https://mi.tv/br/programacao", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    // Esperar o container de canais carregar
    await page.waitForSelector("#channels", { timeout: 15000 });

    const data = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll("#channels .channel").forEach(el => {
        const channelHeader = el.querySelector('a.c');
        if (!channelHeader) return;

        const nome = channelHeader.querySelector('h3')?.innerText.trim() || channelHeader.getAttribute('title');
        const logo = channelHeader.querySelector('img')?.src;
        const slug = channelHeader.getAttribute('href')?.split('/').pop();

        const programas = [];
        el.querySelectorAll('ul.broadcasts li').forEach(li => {
          const title = li.querySelector('.title')?.innerText.trim();
          const time = li.querySelector('.time')?.innerText.trim();
          const isLive = li.classList.contains('live');

          if (title && time) {
            programas.push({ title, time, isLive });
          }
        });

        if (nome && programas.length > 0) {
          results.push({ nome, logo, slug, programas });
        }
      });
      return results;
    });

    console.log(`[Scraper Puppeteer] Sucesso! ${data.length} canais reconstruídos.`);
    await browser.close();
    return data;
  } catch (err) {
    console.error(`[Scraper Puppeteer] Erro: ${err.message}`);
    if (browser) await browser.close();
    throw err;
  }
}

module.exports = { scrapeMiTVPuppeteer };
