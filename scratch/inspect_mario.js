const TMDB_API_KEY = "bef325d5616036e502edb3cdc104e7fd";
const movieId = "502356"; 

async function test() {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("Videos found:", data.results?.map(v => ({ name: v.name, key: v.key, site: v.site, type: v.type })));
}

test();
