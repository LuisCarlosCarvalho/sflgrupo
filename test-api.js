require('ts-node').register({ transpileOnly: true });
const { GET } = require('./src/app/api/games/upcoming/route.ts');

async function test() {
   const res = await GET();
   const data = await res.json();
   console.log(JSON.stringify(data, null, 2));
}

test();
