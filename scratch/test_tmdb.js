const TMDB_API_KEY = "bef325d5616036e502edb3cdc104e7fd";
const movieId = "502356"; // Super Mario Bros. O Filme (2023)

async function test() {
    console.log("Testing TMDB for Super Mario...");
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("Results (pt-BR):", data.results?.length);
    
    if (!data.results || data.results.length === 0) {
        const urlEn = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`;
        const resEn = await fetch(urlEn);
        const dataEn = await resEn.json();
        console.log("Results (en-US):", dataEn.results?.length);
    }
}

test();
