const express = require("express");
const router = express.Router();
const { getProgramacao } = require("../services/aggregator.service");
const { setCache } = require("../services/cache.service");

// Forçar atualização manual da grade
router.post("/refresh", async (req, res) => {
  console.log("[Admin] Refresh manual disparado!");
  try {
    const data = await getProgramacao();
    setCache(data);

    res.json({
      status: "ok",
      count: data.length,
      atualizado_em: new Date()
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
