const { scrapeMiTV } = require("../scrapers/mitv.scraper");
const { scrapeMiTVPuppeteer } = require("../scrapers/mitv.puppeteer");
const { scrapeXMLTV } = require("../scrapers/xmltv.scraper");

async function getProgramacao() {
  try {
    console.log("[Aggregator] Tentando fonte Robusta (XMLTV)...");
    const data = await scrapeXMLTV();

    if (data && data.length > 0) {
      console.log("[Aggregator] XMLTV retornou dados com sucesso.");
      return data;
    }
    throw new Error("XMLTV vazio");
  } catch (err) {
    console.warn(`[Aggregator] Falha no XMLTV: ${err.message}. Fallback para Mi.TV Scraper...`);
    
    try {
      const data = await scrapeMiTV();
      if (data && data.length > 0) return data;
      throw new Error("Mi.TV Scraper vazio");
    } catch (mitvErr) {
      console.log("[Aggregator] Fallback crítico para Mi.TV Puppeteer...");
      return await scrapeMiTVPuppeteer();
    }
  }
}

module.exports = { getProgramacao };
