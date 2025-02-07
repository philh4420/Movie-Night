import { createStore } from "vuex";
import movies from "./modules/movies";
import polls from "./modules/polls";

export default createStore({
  state: {
    loading: false, // ✅ Global loading state
    error: null, // ✅ Global error state
  },
  mutations: {
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, errorMessage) {
      state.error = errorMessage;
    },
  },
  actions: {
    setLoading({ commit }, isLoading) {
      commit("SET_LOADING", isLoading);
    },
    setError({ commit }, errorMessage) {
      commit("SET_ERROR", errorMessage);
    },
  },
  modules: {
    movies,
    polls,
  },
});