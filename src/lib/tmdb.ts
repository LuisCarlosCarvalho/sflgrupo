import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: "pt-BR",
  },
});

export const getMovies = async (endpoint: string) => {
  try {
    const { data } = await tmdb.get(endpoint);
    return data.results.map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      thumbnailUrl: `${IMAGE_BASE_URL}${item.poster_path || item.backdrop_path}`,
      genre: item.release_date ? item.release_date.substring(0, 4) : "2024",
      rating: item.vote_average ? `${(item.vote_average * 10).toFixed(0)}% Relevância` : "95% Relevância",
    }));
  } catch (error) {
    console.error("TMDB Fetch Error:", error);
    return [];
  }
};

export const endpoints = {
  popular: "/movie/popular",
  series: "/tv/popular",
  kids: "/discover/movie?with_genres=10751",
  trending: "/trending/all/week",
};
