const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '../../cache_data.json');

let cache = null;
let lastUpdate = null;

// Tentar carregar do disco ao iniciar
try {
  if (fs.existsSync(CACHE_FILE)) {
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    cache = data.cache;
    lastUpdate = new Date(data.lastUpdate);
    console.log("[Cache] Dados restaurados do disco.");
  }
} catch (e) {
  console.warn("[Cache] Falha ao restaurar do disco:", e.message);
}

function getCache() {
  return { cache, lastUpdate };
}

function setCache(data) {
  cache = data;
  lastUpdate = new Date();
  
  // Persistir no disco para sobrevivência a reinícios
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ cache, lastUpdate }));
    console.log("[Cache] Dados persistidos no disco.");
  } catch (e) {
    console.error("[Cache] Erro ao persistir:", e.message);
  }
}

module.exports = { getCache, setCache };
