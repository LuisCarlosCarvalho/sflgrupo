const { createClient } = require('@supabase/supabase-js');
const xml2js = require('xml2js');
const http = require('http');

const supabase = createClient('https://nelntzdujdydstvgbzsy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbG50emR1amR5ZHN0dmdienN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg4NDg4NCwiZXhwIjoyMDkyNDYwODg0fQ.xNWRpUGVsDS5W5-7zcMTJDVtNEz-xbqx8ZMM3xiVgGs');

const url = 'http://sflmitv.live:8880/xmltv.php?username=81629858&password=54803584';

function getCategory(name) {
  const n = name.toUpperCase();
  if (n.includes('SPORTV') || n.includes('ESPN') || n.includes('PREMIERE') || n.includes('COMBATE') || n.includes('BANDSPORTS') || n.includes('FOX SPORTS') || n.includes('DAZN') || n.includes('CONMEBOL')) return 'Esportes';
  if (n.includes('TELECINE') || n.includes('HBO') || n.includes('CINEMAX') || n.includes('SPACE') || n.includes('MEGAPIX') || n.includes('TNT') || n.includes('FOX') || n.includes('STAR') || n.includes('PARAMOUNT') || n.includes('SONY') || n.includes('WARNER') || n.includes('UNIVERSAL') || n.includes('AXN') || n.includes('A&E') || n.includes('CINECANAL') || n.includes('AMC')) return 'Filmes/Séries';
  if (n.includes('DISCOVERY') || n.includes('HISTORY') || n.includes('NAT GEO') || n.includes('ANIMAL PLANET') || n.includes('FISHING') || n.includes('OFF') || n.includes('TLC') || n.includes('SMITHSONIAN') || n.includes('ARTE 1')) return 'Documentários';
  if (n.includes('GLOBO') || n.includes('SBT') || n.includes('RECORD') || n.includes('BAND') || n.includes('REDETV') || n.includes('CULTURA') || n.includes('GAZETA') || n.includes('SÉCULO') || n.includes('VIDA') || n.includes('APARECIDA')) return 'Abertos';
  if (n.includes('CARTOON') || n.includes('DISNEY') || n.includes('NICKELODEON') || n.includes('NICK') || n.includes('BOOMERANG') || n.includes('GLOOB') || n.includes('TOONCAST') || n.includes('ZOO MOO')) return 'Infantil';
  if (n.includes('CNN') || n.includes('BANDNEWS') || n.includes('GLOBONEWS') || n.includes('JAZEERA') || n.includes('BBC') || n.includes('BLOOMBERG') || n.includes('JOVEM PAN')) return 'Notícias';
  if (n.includes('MTV') || n.includes('MULTISHOW') || n.includes('BIS') || n.includes('GNT') || n.includes('VIVA') || n.includes('COMEDY CENTRAL') || n.includes('LIFETIME') || n.includes('SYFY') || n.includes('E!') || n.includes('FASHION')) return 'Variedades/Música';
  if (n.includes('PLAYBOY') || n.includes('SEXPRIVE') || n.includes('VENUS') || n.includes('+18')) return 'Adulto';
  return 'Geral';
}

console.log("Iniciando download do EPG...");

let xmlData = '';
http.get(url, res => {
  res.on('data', chunk => { xmlData += chunk; });
  res.on('end', () => {
    console.log("Download concluído. Fazendo parse XML...");
    xml2js.parseString(xmlData, async (err, result) => {
      if (err) {
        console.error("Erro no parse:", err);
        return;
      }
      
      const channels = result.tv.channel;
      console.log(`Encontrados ${channels.length} canais no EPG.`);
      
      // Mapear os canais com categoria e deduplicar baseado no nome? Não, vamos inserir todos
      // Mas para não sobrecarregar a UI de uma vez, e para agrupar as resoluções
      // Supabase insert em lotes de 100
      
      const toInsert = channels.map((ch, idx) => {
        const id = ch.$ ? ch.$.id : String(idx);
        let name = "Desconhecido";
        if (ch['display-name']) {
           name = typeof ch['display-name'][0] === 'string' ? ch['display-name'][0] : ch['display-name'][0]._;
        }
        
        let logo = '';
        if (ch.icon && ch.icon[0] && ch.icon[0].$ && ch.icon[0].$.src) {
           logo = ch.icon[0].$.src;
        }
        
        return {
          name: name,
          logo_url: logo,
          stream_url: "https://example.com/stream.m3u8",
          category: getCategory(name),
          epg_channel_id: id,
          number: idx + 1
        };
      });
      
      console.log("Apagando canais antigos...");
      await supabase.from('tv_channels').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // hack for delete all
      
      console.log("Inserindo novos canais...");
      const BATCH_SIZE = 200;
      for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
        const batch = toInsert.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('tv_channels').insert(batch);
        if (error) {
          console.error("Erro ao inserir lote:", error);
        } else {
          console.log(`Lote inserido: ${i} a ${i + BATCH_SIZE}`);
        }
      }
      
      console.log("Sincronização concluída com sucesso!");
    });
  });
}).on('error', console.error);
