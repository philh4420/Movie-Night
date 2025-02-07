import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: "en-US",
  },
});

const state = {
  movies: [],
  genres: [],
  selectedMovie: null,
  lastFetchTime: null, // ✅ Track last API fetch time
  loading: false, // ✅ Local loading state
  error: null, // ✅ Centralized error state
};

const mutations = {
  SET_MOVIES(state, movies) {
    state.movies = movies;
    state.lastFetchTime = Date.now(); // ✅ Update fetch timestamp
  },
  SET_GENRES(state, genres) {
    state.genres = genres;
  },
  SET_SELECTED_MOVIE(state, movie) {
    state.selectedMovie = movie;
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  // ✅ Fetch popular movies (with caching)
  async fetchPopularMovies({ state, commit }) {
    const cacheDuration = 24 * 60 * 60 * 1000; // ✅ 24 hours
    const now = Date.now();

    if (state.movies.length > 0 && now - state.lastFetchTime < cacheDuration) {
      console.log("Using cached movies...");
      return; // ✅ Use cached data if not expired
    }

    commit("SET_LOADING", true);
    try {
      const response = await apiClient.get("/movie/popular");
      commit("SET_MOVIES", response.data.results);
    } catch (error) {
      commit("SET_ERROR", "Failed to load popular movies.");
      commit("SET_MOVIES", []); // Fallback to empty list
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // ✅ Fetch genres (only if not already cached)
  async fetchGenres({ state, commit }) {
    if (state.genres.length > 0) return; // ✅ Use cached genres

    try {
      const response = await apiClient.get("/genre/movie/list");
      commit("SET_GENRES", response.data.genres);
    } catch (error) {
      commit("SET_ERROR", "Failed to load genres.");
      commit("SET_GENRES", []);
    }
  },

  // ✅ Search movies dynamically
  async searchMovies({ commit }, query) {
    if (!query) return;
    commit("SET_LOADING", true);
    try {
      const response = await apiClient.get("/search/movie", {
        params: { query },
      });
      commit("SET_MOVIES", response.data.results);
    } catch (error) {
      commit("SET_ERROR", "Failed to search movies.");
      commit("SET_MOVIES", []);
    } finally {
      commit("SET_LOADING", false);
    }
  },
};

const getters = {
  movies: (state) => state.movies,
  genres: (state) => state.genres,
  loading: (state) => state.loading,
  error: (state) => state.error,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};