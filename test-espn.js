const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://www.espn.com.br/nba/calendario').then(res => {
  const $ = cheerio.load(res.data);
  $('.Table__Team').first().each((i, el) => {
    const link = $(el).find('a').attr('href');
    console.log("LINK:", link);
    if (link) {
      const match = link.match(/\/name\/([^\/]+)\//);
      if (match) {
        const logoUrl = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${match[1]}.png`;
        console.log("LOGO:", logoUrl);
      }
    }
  });
});
