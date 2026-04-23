const TMDB_API_KEY = "bef325d5616036e502edb3cdc104e7fd";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const formatData = (item: any) => ({
  id: item.id.toString(),
  title: item.title || item.name,
  description: item.overview,
  thumbnailUrl: `${IMAGE_BASE_URL}${item.poster_path}`,
  backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
  genre: "Destaque SFL",
  rating: item.vote_average ? (item.vote_average * 10).toFixed(0) : "95",
  duration: item.release_date ? item.release_date.substring(0, 4) : item.first_air_date ? item.first_air_date.substring(0, 4) : "2024",
});

async function fetchTMDB(endpoint: string, params: string = "") {
  try {
    const url = `${BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=pt-BR${params}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.results ? data.results.map(formatData) : [];
  } catch (error) {
    console.error("TMDB Fetch Error:", error);
    return [];
  }
}

export const getPopularMovies = () => fetchTMDB("/movie/popular");
export const getPopularSeries = () => fetchTMDB("/tv/popular");
export const getTrendingMovies = () => fetchTMDB("/trending/movie/week");
export const getTrendingSeries = () => fetchTMDB("/trending/tv/week");
export const getKidsContent = () => fetchTMDB("/discover/movie", "&with_genres=10751&sort_by=popularity.desc");

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
