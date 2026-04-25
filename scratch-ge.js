const axios = require('axios');

async function testGE() {
  const urls = [
    'https://api.ge.globo.com/futebol/esportes/futebol/campeonatos/brasileirao-serie-a/jogos',
    'https://api.globoesporte.globo.com/tabela/d1a37fa4-e948-43a6-ba53-ab24ab3a45b1/fase/fase-unica-seriea-2023/jogos',
    'https://api.globoesporte.globo.com/tabela/d1a37fa4-e948-43a6-ba53-ab24ab3a45b1/equipes',
    'https://api.globoesporte.globo.com/futebol/brasileirao-serie-a/agenda'
  ];
  
  for (const url of urls) {
      try {
          const { data } = await axios.get(url);
          console.log("SUCCESS:", url, typeof data);
      } catch(e) {
          console.log("FAIL:", url, e.message);
      }
  }
}
testGE();
