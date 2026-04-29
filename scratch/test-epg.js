const { getEPGData } = require('./src/lib/tv/epg-service');

async function test() {
  console.log("Iniciando teste de EPG...");
  try {
    const data = await getEPGData();
    console.log("Canais encontrados:", Object.keys(data).length);
    if (Object.keys(data).length > 0) {
      console.log("Exemplo de canais:", Object.keys(data).slice(0, 10));
    }
  } catch (err) {
    console.error("Erro no teste:", err);
  }
}

test();
