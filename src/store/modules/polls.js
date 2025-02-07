import { database, ref, set, get, onValue, update, remove, off } from "@/firebase";
import axios from "axios";

export default {
  namespaced: true,
  state: {
    pollId: null,
    pollOptions: [],
    pollVotes: [],
    userVote: null,
    lastPollUpdate: null,
    loading: false,
    error: null,
  },

  getters: {
    pollOptions: (state) => state.pollOptions,
    pollVotes: (state) => state.pollVotes,
    userVote: (state) => state.userVote,
    lastPollUpdate: (state) => state.lastPollUpdate,
    loading: (state) => state.loading,
    error: (state) => state.error,
    pollId: (state) => state.pollId,
  },

  mutations: {
    SET_POLL_ID(state, pollId) {
      state.pollId = pollId;
    },
    SET_POLL_OPTIONS(state, options) {
      state.pollOptions = options.map((movie) => ({
        id: movie.id ?? null,
        title: movie.title ?? "Unknown Title",
        poster_path: movie.poster_path ?? null,
        release_date: movie.release_date ?? "N/A",
        vote_average: movie.vote_average ?? 0,
        genres: movie.genres ?? [],
        runtime: movie.runtime ?? 0,
      }));
      state.pollVotes = new Array(options.length).fill(0);
      state.userVote = null;
    },
    UPDATE_VOTES(state, newVotes) {
      state.pollVotes = newVotes;
    },
    CAST_VOTE(state, { optionIndex }) {
      state.userVote = optionIndex;
    },
    RESET_POLL(state) {
      state.pollId = null;
      state.pollOptions = [];
      state.pollVotes = [];
      state.userVote = null;
    },
    SET_LAST_POLL_UPDATE(state, timestamp) {
      state.lastPollUpdate = timestamp;
    },
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },

  actions: {
    async loadPoll({ commit, dispatch }) {
      commit("SET_LOADING", true);
      try {
        const pollListRef = ref(database, "polls");
        const snapshot = await get(pollListRef);

        if (snapshot.exists()) {
          const polls = snapshot.val();
          const pollIds = Object.keys(polls);
          const latestPollId = pollIds[pollIds.length - 1];
          const pollData = polls[latestPollId];
          const now = Date.now();

          if (!pollData.options || pollData.options.length === 0) {
            console.warn("Poll data is empty. Fetching a new poll...");
            await dispatch("fetchAndSavePoll");
            return;
          }

          if (pollData.lastUpdated && now - pollData.lastUpdated > 24 * 60 * 60 * 1000) {
            console.warn("Poll is outdated. Fetching a new poll...");
            await dispatch("fetchAndSavePoll");
          } else {
            commit("SET_POLL_ID", latestPollId);
            commit("SET_POLL_OPTIONS", pollData.options);
            commit("UPDATE_VOTES", pollData.votes);
            commit("SET_LAST_POLL_UPDATE", pollData.lastUpdated);
            dispatch("listenToPollUpdates", latestPollId);
          }
        } else {
          console.warn("No poll data found. Fetching from TMDB...");
          await dispatch("fetchAndSavePoll");
        }
      } catch (error) {
        console.error("Error loading poll data:", error);
        commit("SET_ERROR", "Failed to load poll data.");
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async fetchAndSavePoll({ commit, dispatch }) {
      commit("SET_LOADING", true);
      try {
        const response = await axios.get("https://api.themoviedb.org/3/movie/popular", {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            language: "en-US",
            page: Math.floor(Math.random() * 500) + 1,
          },
        });

        const movies = response.data.results
          .filter((movie) => movie.id && movie.vote_count > 50)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);

        const moviesWithDetails = await Promise.all(
          movies.map(async (movie) => {
            try {
              const detailsResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}`,
                { params: { api_key: import.meta.env.VITE_TMDB_API_KEY, language: "en-US" } }
              );

              return {
                id: movie.id,
                title: movie.title ?? "Unknown Title",
                poster_path: movie.poster_path ?? null,
                release_date: movie.release_date ?? "N/A",
                vote_average: movie.vote_average ?? 0,
                genres: detailsResponse.data.genres.map((genre) => genre.id) ?? [], // Use genre IDs
                runtime: detailsResponse.data.runtime ?? 0,
              };
            } catch (error) {
              console.error(`Error fetching details for movie ID ${movie.id}:`, error);
              return {
                id: movie.id,
                title: movie.title ?? "Unknown Title",
                poster_path: movie.poster_path ?? null,
                release_date: movie.release_date ?? "N/A",
                vote_average: movie.vote_average ?? 0,
                genres: [],
                runtime: 0,
              };
            }
          })
        );

        const now = Date.now();
        const newPollId = `poll_${now}`;
        const pollRef = ref(database, `polls/${newPollId}`);

        await set(pollRef, {
          options: moviesWithDetails,
          votes: new Array(moviesWithDetails.length).fill(0),
          lastUpdated: now,
        });

        commit("SET_POLL_ID", newPollId);
        commit("SET_POLL_OPTIONS", moviesWithDetails);
        commit("SET_LAST_POLL_UPDATE", now);

        dispatch("listenToPollUpdates", newPollId);
      } catch (error) {
        console.error("Error fetching movies from TMDB:", error);
        commit("SET_ERROR", "Failed to fetch movies.");
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async voteInPoll({ commit, state }, optionIndex) {
      if (!state.pollId) {
        commit("SET_ERROR", "No active poll.");
        return;
      }

      commit("SET_LOADING", true);
      try {
        const pollVotesRef = ref(database, `polls/${state.pollId}/votes`);
        const newVotes = [...state.pollVotes];
        newVotes[optionIndex] += 1;

        await update(pollVotesRef, { [`${optionIndex}`]: newVotes[optionIndex] });
        commit("CAST_VOTE", { optionIndex });
      } catch (error) {
        console.error("Error submitting vote:", error);
        commit("SET_ERROR", "Failed to submit vote.");
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async resetPoll({ commit, dispatch, state }) {
      commit("SET_LOADING", true);
      try {
        if (state.pollId) {
          const pollRef = ref(database, `polls/${state.pollId}`);
          await remove(pollRef);
        }

        commit("RESET_POLL");
        await dispatch("fetchAndSavePoll");
      } catch (error) {
        console.error("Error resetting poll:", error);
        commit("SET_ERROR", "Failed to reset poll.");
      } finally {
        commit("SET_LOADING", false);
      }
    },

    listenToPollUpdates({ commit }, pollId) {
      const pollRef = ref(database, `polls/${pollId}`);
      onValue(pollRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.votes) {
            commit("UPDATE_VOTES", data.votes);
          }
          if (data.options) {
            commit("SET_POLL_OPTIONS", data.options);
          }
        }
      });
    },
  },
};