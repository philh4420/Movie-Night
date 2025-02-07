<template>
  <div class="home">
    <h2 class="page-title">Browse Movies</h2>

    <!-- Movie Search Bar -->
    <MovieSearchBar @search="handleSearch" />

    <!-- Loading Indicator -->
    <div v-if="loading" class="loading-message">
      <span>Loading movies...</span>
    </div>

    <!-- Movies Grid -->
    <div v-if="movies.length && !loading" class="movie-grid">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movieId="movie.id"
        :title="movie.title"
        :posterPath="movie.poster_path"
        :rating="movie.vote_average"
        :genres="movie.genre_ids.map((id) => genreMap[id])"
        :releaseDate="movie.release_date"
        :overview="movie.overview"
        @movie-selected="selectMovie"
      />
    </div>

    <!-- No Results -->
    <div v-else-if="!loading" class="no-results">
      <p>No movies found. Try searching for something else!</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import MovieCard from "@/components/MovieCard.vue";
import MovieSearchBar from "@/components/MovieSearchBar.vue";

export default {
  name: "Home",
  components: {
    MovieCard,
    MovieSearchBar,
  },
  computed: {
    ...mapState("movies", ["loading"]), // ✅ Use correct Vuex module namespace
    ...mapGetters("movies", ["movies", "genres"]),
    genreMap() {
      return this.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});
    },
  },
  created() {
    this.fetchGenres();
    this.fetchPopularMovies();
  },
  methods: {
    ...mapActions("movies", ["fetchPopularMovies", "fetchGenres", "searchMovies"]),
    handleSearch(query) {
      if (!query) {
        this.fetchPopularMovies();
      } else {
        this.searchMovies(query);
      }
    },
    selectMovie(movie) {
      this.$router.push(`/movie/${movie.id}`);
    },
  },
};
</script>

<style scoped>
/* Home Page */
.home {
  padding: 2rem;
  background-color: var(--color-bg, #f9f9f9);
  color: var(--color-text-primary, #333);
  border-radius: var(--radius-lg, 8px);
  box-shadow: var(--shadow-lg, 0 8px 16px rgba(0, 0, 0, 0.1));
  animation: fadeIn 0.5s ease-in-out;
  max-width: 1200px;
}

/* Title */
.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: var(--color-primary, #4f46e5);
  margin-bottom: 2rem;
}

/* Loading */
.loading-message {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-primary, #4f46e5);
  margin: 2rem 0;
}

/* No Results */
.no-results {
  text-align: center;
  margin-top: 2rem;
  font-size: 1.1rem;
  color: var(--color-text-secondary, #555);
}

/* Movies Grid */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .home {
    padding: 1.5rem;
  }
  .page-title {
    font-size: 2rem;
  }
  .loading-message,
  .no-results {
    font-size: 1rem;
  }
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>