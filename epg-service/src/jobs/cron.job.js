const cron = require("node-cron");
const { getProgramacao } = require("../services/aggregator.service");
const { setCache } = require("../services/cache.service");

// Atualização automática à meia-noite (00:00) todos os dias
cron.schedule("0 0 * * *", async () => {
  console.log("[Job] Iniciando atualização automática diária...");
  try {
    const data = await getProgramacao();
    setCache(data);
    console.log("[Job] Atualização concluída com sucesso.");
  } catch (err) {
    console.error("[Job] Falha na atualização automática:", err.message);
  }
});

console.log("[Job] Cron agendado (00:00 diário).");
