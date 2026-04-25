const axios = require('axios');
const fs = require('fs');

async function dump() {
  try {
    const { data: sherdog } = await axios.get('https://www.sherdog.com/events');
    fs.writeFileSync('sherdog.html', sherdog);
    
    const { data: ufc } = await axios.get('https://www.ufc.com/events');
    fs.writeFileSync('ufc.html', ufc);
    
    const { data: ge } = await axios.get('https://ge.globo.com/futebol/brasileirao-serie-a/');
    fs.writeFileSync('ge.html', ge);

    console.log("Dumped!");
  } catch (e) {
    console.error(e.message);
  }
}
dump();
