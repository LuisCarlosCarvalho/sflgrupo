const express = require("express");
const router = express.Router();
const { getProgramacao } = require("../services/aggregator.service");
const { getCache, setCache } = require("../services/cache.service");

// Endpoint principal para o Frontend
router.get("/", async (req, res) => {
  const { cache, lastUpdate } = getCache();

  if (!cache) {
    console.log("[Route] Cache vazio. Iniciando busca inicial...");
    try {
      const data = await getProgramacao();
      setCache(data);
      return res.json({ cache: data, lastUpdate: new Date() });
    } catch (err) {
      return res.status(500).json({ error: "Falha ao carregar programação inicial", message: err.message });
    }
  }

  res.json({ cache, lastUpdate });
});

module.exports = router;
