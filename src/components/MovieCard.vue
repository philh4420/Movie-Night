<template>
  <div
    v-if="!error"
    class="movie-card"
    @click="onCardClick"
    tabindex="0"
    role="button"
    aria-label="View movie details"
  >
    <!-- Poster -->
    <div class="movie-poster-container">
      <img
        v-if="movie.poster_path"
        :src="posterUrl"
        :alt="`${movie.title} Poster`"
        class="movie-poster"
      />
      <div v-else class="placeholder-poster">
        No Poster Available
      </div>
      <!-- Rating Badge -->
      <div class="movie-rating" v-if="movie.vote_average">
        {{ movie.vote_average.toFixed(1) }}
      </div>
    </div>

    <!-- Info Section -->
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <p class="movie-release-year">{{ releaseYear }}</p>
      <p class="movie-genres">{{ genreString }}</p>
      <p class="movie-overview">{{ truncatedOverview }}</p>
    </div>
  </div>

  <!-- Error Message -->
  <div v-else class="error-message">
    <p>{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MovieCard",
  props: {
    movieId: {
      type: Number,
      required: true, // Movie ID from TMDB
    },
  },
  data() {
    return {
      movie: {}, // Movie data fetched from TMDB
      loading: true, // Loading state
      error: null, // Error message (if any)
    };
  },
  computed: {
    posterUrl() {
      const baseUrl = "https://image.tmdb.org/t/p/w500";
      return this.movie.poster_path ? `${baseUrl}${this.movie.poster_path}` : null;
    },
    releaseYear() {
      return this.movie.release_date
        ? new Date(this.movie.release_date).getFullYear()
        : "Unknown";
    },
    genreString() {
      return this.movie.genres
        ? this.movie.genres.map((genre) => genre.name).join(", ")
        : "No Genres Available";
    },
    truncatedOverview() {
      return this.movie.overview && this.movie.overview.length > 120
        ? this.movie.overview.slice(0, 120) + "..."
        : this.movie.overview || "No overview available.";
    },
  },
  methods: {
    async fetchMovieDetails() {
      if (!this.movieId) {
        this.error = "Invalid movie ID provided.";
        console.error("MovieCard: movieId is undefined.");
        this.loading = false;
        return;
      }

      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY; // Access API key from .env
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${this.movieId}`,
          {
            params: {
              api_key: apiKey,
              language: "en-US",
            },
          }
        );
        this.movie = response.data;
      } catch (error) {
        this.error = "Failed to fetch movie details.";
        console.error("AxiosError:", error);
      } finally {
        this.loading = false;
      }
    },
    onCardClick() {
      this.$emit("movie-selected", this.movie); // Emit the full movie object to the parent
    },
  },
  created() {
    this.fetchMovieDetails(); // Fetch movie details when the component is created
  },
};
</script>

<style scoped>
/* MovieCard Styles */
.movie-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-card-bg, #ffffff);
  border-radius: var(--radius-lg, 8px);
  box-shadow: var(--shadow-md, 0 4px 8px rgba(0, 0, 0, 0.1));
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  outline: none;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg, 0 8px 16px rgba(0, 0, 0, 0.2));
}

.movie-card:focus {
  outline: 2px solid var(--color-primary, #4f46e5);
}

/* Poster Section */
.movie-poster-container {
  width: 100%;
  aspect-ratio: 2 / 3;
  position: relative;
  overflow: hidden;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
}

/* Placeholder Poster */
.placeholder-poster {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, var(--color-secondary, #818cf8), var(--color-dark-blue, #3b82f6));
  color: var(--color-white, #ffffff);
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
}

/* Rating Badge */
.movie-rating {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  font-size: 1rem;
  font-weight: bold;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  color: var(--color-white, #ffffff);
  z-index: 2;
}

/* Info Section */
.movie-info {
  padding: 1rem;
  text-align: center;
}

.movie-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary, #333333);
}

.movie-release-year,
.movie-genres {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #666666);
}

.movie-overview {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #666666);
  margin-top: 0.5rem;
  line-height: 1.4;
}

/* Error Message */
.error-message {
  text-align: center;
  color: var(--color-error, #e74c3c);
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .movie-card {
    margin: 0.5rem;
  }

  .movie-title {
    font-size: 1rem;
  }

  .movie-overview {
    font-size: 0.8rem;
  }
}
</style>