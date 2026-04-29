require('dotenv').config();
const express = require("express");
const axios = require("axios");
const zlib = require("zlib");
const xml2js = require("xml2js");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

let cache = null;
let lastUpdate = null;

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
    
    if (error || !data) return "https://epgshare01.online/epgshare01/epg_ripper_ALL_SOURCES1.xml.gz";
    return data.value;
  } catch (e) {
    return "https://epgshare01.online/epgshare01/epg_ripper_ALL_SOURCES1.xml.gz";
  }
}

async function atualizarEPG() {
  const urlRaw = await getEPGUrl();
  const url = extrairUrl(urlRaw);
  
  if (!url || !url.startsWith('http')) {
    throw new Error(`Invalid URL detectada: [${url}]. Certifique-se de que a URL comece com http.`);
  }

  console.log(`🚀 Baixando EPG de: ${url}`);
  
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "arraybuffer",
      timeout: 120000
    });

    console.log("📦 Dados recebidos. Processando...");
    let xml;
    try {
      xml = zlib.gunzipSync(response.data).toString("utf-8");
    } catch (e) {
      xml = response.data.toString("utf-8");
    }

    const json = await xml2js.parseStringPromise(xml, { explicitArray: false });

    if (!json.tv) throw new Error("A fonte não é um XMLTV válido.");

    const canais = {};
    const channelList = Array.isArray(json.tv.channel) ? json.tv.channel : [json.tv.channel];
    channelList.forEach(c => {
      const id = c.$.id;
      const nome = Array.isArray(c["display-name"]) ? c["display-name"][0] : c["display-name"];
      canais[id] = { nome, logo: c.icon?.$.src || null, programas: [] };
    });

    if (json.tv.programme) {
      const programmeList = Array.isArray(json.tv.programme) ? json.tv.programme : [json.tv.programme];
      programmeList.forEach(p => {
        const canalId = p.$.channel;
        if (canais[canalId]) {
          canais[canalId].programas.push({
            titulo: p.title?._ || p.title,
            inicio: p.$.start,
            fim: p.$.stop,
            descricao: p.desc?._ || p.desc || ""
          });
        }
      });
    }

    cache = Object.values(canais);
    lastUpdate = new Date();
    console.log(`✅ Sucesso! ${cache.length} canais prontos.`);
  } catch (err) {
    console.error("❌ Erro no Processamento:", err.message);
    throw err;
  }
}

app.get("/api/programacao", async (req, res) => {
  if (!cache) {
    try {
      await atualizarEPG();
    } catch (err) {
      return res.status(500).json({ error: "Erro", message: err.message });
    }
  }
  res.json({ atualizado_em: lastUpdate, canais: cache });
});

app.post("/api/admin/refresh", async (req, res) => {
  try {
    await atualizarEPG();
    res.json({ ok: true, atualizado_em: lastUpdate });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`📡 EPG Service ativo na porta ${PORT}`);
});
