export interface M3UChannel {
  id: string;
  name: string;
  logo: string;
  group: string;
  url: string;
}

export async function fetchAndParseM3U(url: string): Promise<M3UChannel[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch M3U: ${response.status}`);
    }
    const text = await response.text();
    const lines = text.split("\n");

    const channels: M3UChannel[] = [];
    let currentChannel: Partial<M3UChannel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith("#EXTINF:")) {
        currentChannel = {};
        
        // Extract tvg-id
        const idMatch = line.match(/tvg-id="([^"]+)"/);
        if (idMatch) currentChannel.id = idMatch[1];
        
        // Extract tvg-logo
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        if (logoMatch) currentChannel.logo = logoMatch[1];
        
        // Extract group-title
        const groupMatch = line.match(/group-title="([^"]+)"/);
        if (groupMatch) {
            currentChannel.group = groupMatch[1];
        } else {
            currentChannel.group = "GERAL";
        }

        // Extract name
        const commaIndex = line.lastIndexOf(",");
        if (commaIndex !== -1) {
          currentChannel.name = line.substring(commaIndex + 1).trim();
        } else {
          currentChannel.name = "Desconhecido";
        }
      } else if (!line.startsWith("#")) {
        // This is the URL
        currentChannel.url = line;
        
        if (currentChannel.name && currentChannel.url) {
          channels.push(currentChannel as M3UChannel);
        }
        currentChannel = {}; // Reset for the next channel
      }
    }

    return channels;
  } catch (error) {
    console.error("[M3U Parser] Error:", error);
    return [];
  }
}
