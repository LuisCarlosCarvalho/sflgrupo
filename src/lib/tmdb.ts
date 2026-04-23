const TMDB_API_KEY = "bef325d5616036e502edb3cdc104e7fd";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const formatData = (item: any, type?: string) => ({
  id: item.id.toString(),
  title: item.title || item.name,
  description: item.overview,
  thumbnailUrl: `${IMAGE_BASE_URL}${item.poster_path}`,
  backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
  genre: "Destaque SFL",
  rating: item.vote_average ? (item.vote_average * 10).toFixed(0) : "95",
  duration: item.release_date ? item.release_date.substring(0, 4) : item.first_air_date ? item.first_air_date.substring(0, 4) : "2024",
  type: type || item.media_type || (item.first_air_date ? "tv" : "movie"),
});

async function fetchTMDB(endpoint: string, params: string = "", type?: string) {
  try {
    const url = `${BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=pt-BR${params}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.results ? data.results.map((item: any) => formatData(item, type)) : [];
  } catch (error) {
    console.error("TMDB Fetch Error:", error);
    return [];
  }
}

export const getPopularMovies = () => fetchTMDB("/movie/popular", "", "movie");
export const getPopularSeries = () => fetchTMDB("/tv/popular", "", "tv");
export const getTrendingMovies = () => fetchTMDB("/trending/movie/week", "", "movie");
export const getTrendingSeries = () => fetchTMDB("/trending/tv/week", "", "tv");
export const getKidsContent = () => fetchTMDB("/discover/movie", "&with_genres=10751&sort_by=popularity.desc", "movie");

export const getHeroMovie = async () => {
  const movies = await getTrendingMovies();
  return movies[0] || null;
};

export const getMovieDetails = async (id: string, type: "movie" | "tv" = "movie") => {
  try {
    const url = `${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data ? formatData(data) : null;
  } catch (error) {
    console.error("TMDB Details Error:", error);
    return null;
  }
};

export const searchMulti = async (query: string) => {
  try {
    const res = await fetch(`${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.results ? data.results.map(formatData) : [];
  } catch (error) {
    console.error("TMDB Search Error:", error);
    return [];
  }
};

export const getMovieVideos = async (id: string, type: "movie" | "tv" = "movie") => {
  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`, { next: { revalidate: 3600 } });
    const data = await res.json();
    // Prioritiza trailers do YouTube
    return data.results?.filter((v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")) || [];
  } catch (error) {
    console.error("TMDB Videos Error:", error);
    return [];
  }
};
