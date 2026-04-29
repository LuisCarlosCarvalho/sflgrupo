const got = require('got');
const zlib = require('zlib');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const XMLTV_URL = "https://epgshare01.online/epgshare01/epg_ripper_ALL_SOURCES1.xml.gz";
const LOCAL_GZ = path.join(__dirname, '../../epg.xml.gz');
const LOCAL_XML = path.join(__dirname, '../../epg.xml');

async function scrapeXMLTV() {
  console.log(`[XMLTV Scraper] Iniciando processamento otimizado (Stream)...`);
  
  try {
    // 1. Download do arquivo compactado para o disco (evita travar a RAM)
    console.log("[XMLTV Scraper] Fazendo download do arquivo...");
    await pipeline(
      got.stream(XMLTV_URL),
      fs.createWriteStream(LOCAL_GZ)
    );

    console.log("[XMLTV Scraper] Download concluído. Descompactando...");
    // 2. Descompactação via Stream
    const gunzip = zlib.createGunzip();
    const source = fs.createReadStream(LOCAL_GZ);
    const destination = fs.createWriteStream(LOCAL_XML);
    
    await pipeline(source, gunzip, destination);
    console.log("[XMLTV Scraper] Arquivo XML pronto para leitura.");

    // 3. Leitura do XML (Apenas canais brasileiros ou necessários para reduzir carga)
    const xmlData = fs.readFileSync(LOCAL_XML, 'utf-8');
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlData);

    const tvData = result.tv;
    const channelsMap = new Map();

    // Mapear Canais (Filtro simples para não estourar a memória do JS)
    if (tvData.channel) {
      const channels = Array.isArray(tvData.channel) ? tvData.channel : [tvData.channel];
      channels.slice(0, 2000).forEach(ch => { // Limite de segurança inicial
        const id = ch.$.id;
        const name = Array.isArray(ch['display-name']) ? ch['display-name'][0] : ch['display-name'];
        const logo = ch.icon ? ch.icon.$.src : '';
        channelsMap.set(id, { nome: name, logo, programas: [] });
      });
    }

    // Mapear Programas
    if (tvData.programme) {
      const programmes = Array.isArray(tvData.programme) ? tvData.programme : [tvData.programme];
      programmes.forEach(p => {
        const channelId = p.$.channel;
        if (channelsMap.has(channelId)) {
          const startStr = p.$.start;
          const endStr = p.$.stop;
          const time = startStr.substring(8, 10) + ":" + startStr.substring(10, 12);

          channelsMap.get(channelId).programas.push({
            title: p.title?._ || p.title,
            time,
            isLive: isCurrentProgram(startStr, endStr)
          });
        }
      });
    }

    const finalData = Array.from(channelsMap.values()).filter(c => c.programas.length > 0);
    console.log(`[XMLTV Scraper] Sucesso! ${finalData.length} canais processados.`);
    
    // Limpeza de arquivos temporários
    try { fs.unlinkSync(LOCAL_GZ); fs.unlinkSync(LOCAL_XML); } catch(e) {}

    return finalData;

  } catch (err) {
    console.error(`[XMLTV Scraper] Erro Crítico: ${err.message}`);
    // Se falhar o XML, o agregador vai tentar o Mi.TV automaticamente
    throw err;
  }
}

function isCurrentProgram(start, end) {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const nowStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}00 +0000`;
  return nowStr >= start && nowStr <= end;
}

module.exports = { scrapeXMLTV };
