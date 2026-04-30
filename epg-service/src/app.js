require('dotenv').config();
const express = require("express");
const axios = require("axios");
const zlib = require("zlib");
const xml2js = require("xml2js");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { getCache, setCache } = require('./services/cache.service');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Função ultra-agressiva de limpeza de URL
function extrairUrl(texto) {
  if (!texto) return null;
  console.log(`[Debug] Analisando texto da URL: "${texto}"`);

  // Procura por qualquer coisa que comece com http e termine em espaço ou fim da linha
  const match = texto.match(/https?:\/\/[^\s*]+/i);
  const urlLimpa = match ? match[0] : texto.trim();

  console.log(`[Debug] URL extraída e limpa: "${urlLimpa}"`);
  return urlLimpa;
}

async function getEPGUrl() {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'epg_url')
      .single();
    
    if (error || !data) return "https://epg.pw/xmltv/epg_BR.xml.gz";
    return data.value;
  } catch (e) {
    return "https://epg.pw/xmltv/epg_BR.xml.gz";
  }
}

async function atualizarEPG() {
  const urlRaw = await getEPGUrl();
  const url = extrairUrl(urlRaw);
  
  if (!url || !url.startsWith('http')) {
    throw new Error(`URL Inválida: [${url}].`);
  }

  console.log(`\n🚀 [EPG] Sincronizando com: ${url}`);
  
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "arraybuffer",
      timeout: 60000 // 1 minuto
    });

    console.log("📦 [EPG] Download concluído. Processando XML...");
    let xml;
    try {
      xml = zlib.gunzipSync(response.data).toString("utf-8");
    } catch (e) {
      xml = response.data.toString("utf-8");
    }

    // Parser mais rápido e tolerante
    const json = await xml2js.parseStringPromise(xml, { 
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: true
    });

    if (!json.tv) {
       console.error("DEBUG: XML recebido não contém tag <tv>:", xml.substring(0, 500));
       throw new Error("A fonte não é um XMLTV válido (falta tag <tv>).");
    }

    const canais = {};
    const channelList = Array.isArray(json.tv.channel) ? json.tv.channel : (json.tv.channel ? [json.tv.channel] : []);
    
    channelList.forEach(c => {
      const id = c.id;
      const nome = Array.isArray(c["display-name"]) ? c["display-name"][0] : c["display-name"];
      canais[id] = { 
        nome: typeof nome === 'object' ? (nome._ || nome['#text'] || JSON.stringify(nome)) : nome, 
        logo: c.icon?.src || null, 
        programas: [] 
      };
    });

    if (json.tv.programme) {
      const programmeList = Array.isArray(json.tv.programme) ? json.tv.programme : [json.tv.programme];
      console.log(`📊 [EPG] Processando ${programmeList.length} programas...`);
      
      programmeList.forEach(p => {
        const canalId = p.channel;
        if (canais[canalId]) {
          canais[canalId].programas.push({
            titulo: p.title?._ || p.title || "Sem Título",
            inicio: p.start,
            fim: p.stop,
            descricao: p.desc?._ || p.desc || ""
          });
        }
      });
    }

    const cacheArray = Object.values(canais);
    setCache(cacheArray);
    console.log(`✅ [EPG] Sucesso! ${cacheArray.length} canais carregados.`);
  } catch (err) {
    console.error("❌ [EPG] Erro no Processamento:", err.message);
    throw err;
  }
}

app.get("/api/programacao", async (req, res) => {
  const { cache, lastUpdate } = getCache();
  
  if (!cache) {
    try {
      await atualizarEPG();
      const updated = getCache();
      return res.json({ atualizado_em: updated.lastUpdate, canais: updated.cache });
    } catch (err) {
      return res.status(500).json({ error: "Erro", message: err.message });
    }
  }
  
  res.json({ atualizado_em: lastUpdate, canais: cache });
});

app.post("/api/admin/refresh", async (req, res) => {
  try {
    await atualizarEPG();
    const updated = getCache();
    res.json({ ok: true, atualizado_em: updated.lastUpdate });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n📡 EPG Service ativo na porta ${PORT}`);
  console.log(`🔗 Endpoint: http://localhost:${PORT}/api/programacao`);
});

