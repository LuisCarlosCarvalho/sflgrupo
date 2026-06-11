import { parseStringPromise } from 'xml2js';

export interface XMLProgram {
  titulo: string;
  inicio: string;
  fim: string;
  logo?: string;
  desc?: string;
}

export interface XMLChannel {
  id: string;
  nome: string;
  logo?: string;
  programas: XMLProgram[];
}

export async function fetchAndParseEPG(url: string): Promise<XMLChannel[]> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch EPG: ${response.status}`);
    }
    
    const xmlData = await response.text();
    const result = await parseStringPromise(xmlData);
    
    if (!result || !result.tv) {
      return [];
    }

    const channelsMap = new Map<string, XMLChannel>();
    
    // Parse channels
    if (result.tv.channel) {
      result.tv.channel.forEach((ch: any) => {
        const id = ch.$?.id;
        if (!id) return;
        
        let name = "Desconhecido";
        if (ch['display-name']) {
          name = typeof ch['display-name'][0] === 'string' 
            ? ch['display-name'][0] 
            : ch['display-name'][0]?._ || "Desconhecido";
        }
        
        let logo = undefined;
        if (ch.icon && ch.icon[0] && ch.icon[0].$?.src) {
          logo = ch.icon[0].$.src;
        }

        channelsMap.set(id, {
          id,
          nome: name,
          logo,
          programas: []
        });
      });
    }

    // Parse programmes
    if (result.tv.programme) {
      result.tv.programme.forEach((prog: any) => {
        const channelId = prog.$?.channel;
        if (!channelId || !channelsMap.has(channelId)) return;
        
        const start = prog.$?.start;
        const stop = prog.$?.stop;
        if (!start || !stop) return;
        
        let title = "Programa";
        if (prog.title) {
          title = typeof prog.title[0] === 'string' 
            ? prog.title[0] 
            : prog.title[0]?._ || "Programa";
        }
        
        let desc = undefined;
        if (prog.desc) {
          desc = typeof prog.desc[0] === 'string'
            ? prog.desc[0]
            : prog.desc[0]?._;
        }

        const channel = channelsMap.get(channelId)!;
        channel.programas.push({
          titulo: title,
          inicio: start,
          fim: stop,
          desc
        });
      });
    }

    return Array.from(channelsMap.values());
  } catch (error) {
    console.error("[EPG Parser] Error:", error);
    return [];
  }
}
