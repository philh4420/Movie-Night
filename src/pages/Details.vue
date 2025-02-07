<template>
  <div class="details" v-if="movie">
    <!-- Movie Header -->
    <div class="details-header">
      <img :src="posterUrl" :alt="movie.title" class="movie-poster" />
      <div class="movie-header-info">
        <h2 class="movie-title">{{ movie.title }}</h2>
        <p class="movie-tagline">{{ movie.tagline || "No tagline available." }}</p>
        <p><strong>Release Date:</strong> {{ movie.release_date }}</p>
        <p><strong>Runtime:</strong> {{ movie.runtime }} minutes</p>
        <p>
          <strong>Genres:</strong>
          <span v-for="(genre, index) in movie.genres" :key="genre.id">
            <a
              :href="`https://www.themoviedb.org/genre/${genre.id}`"
              target="_blank"
              class="genre-link"
            >
              {{ genre.name }}
            </a>
            <span v-if="index < movie.genres.length - 1">, </span>
          </span>
        </p>
        <p><strong>Language:</strong> {{ movie.original_language.toUpperCase() }}</p>
        <p>
          <strong>Production Companies:</strong>
          <span v-for="(company, index) in movie.production_companies" :key="company.id">
            <a
              :href="`https://www.themoviedb.org/company/${company.id}`"
              target="_blank"
              class="company-link"
            >
              {{ company.name }}
            </a>
            <span v-if="index < movie.production_companies.length - 1">, </span>
          </span>
        </p>
      </div>
    </div>

    <!-- Movie Overview -->
    <div class="movie-info">
      <h3>Overview</h3>
      <p>{{ movie.overview || "No overview available." }}</p>

      <h3>Details</h3>
      <p><strong>Vote Average:</strong> {{ movie.vote_average }}</p>
      <p><strong>Vote Count:</strong> {{ movie.vote_count }}</p>
      <p><strong>Budget:</strong> {{ formattedBudget }}</p>
      <p><strong>Revenue:</strong> {{ formattedRevenue }}</p>
      <p>
        <strong>Homepage:</strong>
        <a v-if="movie.homepage" :href="movie.homepage" target="_blank" rel="noopener noreferrer">
          Visit Movie Homepage
        </a>
        <span v-else>N/A</span>
      </p>
    </div>

    <!-- Cast and Crew Section -->
    <div class="credits" v-if="credits">
      <div class="credits-section">
        <h3>Cast</h3>
        <ul class="credits-list">
          <li v-for="cast in credits.cast.slice(0, 10)" :key="cast.id" class="credits-item">
            <img
              :src="cast.profile_path ? castImageUrl(cast.profile_path) : placeholderImage"
              :alt="cast.name"
              class="credits-photo"
            />
            <p class="credits-name">
              <a :href="`https://www.themoviedb.org/person/${cast.id}`" target="_blank">
                {{ cast.name }}
              </a>
            </p>
            <p class="credits-role">{{ cast.character }}</p>
          </li>
        </ul>
      </div>

      <div class="credits-section">
        <h3>Crew</h3>
        <ul class="credits-list">
          <li v-for="crew in credits.crew.slice(0, 10)" :key="crew.id" class="credits-item">
            <p class="credits-name">
              <a :href="`https://www.themoviedb.org/person/${crew.id}`" target="_blank">
                {{ crew.name }}
              </a>
            </p>
            <p class="credits-role">{{ crew.job }}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="movie-recommendations" v-if="recommendations.length">
      <h3>Recommended Movies</h3>
      <div class="recommendations-list">
        <div
          v-for="recommendation in recommendations"
          :key="recommendation.id"
          class="recommendation-item"
        >
          <a :href="`/movie/${recommendation.id}`">
            <img
              :src="recommendation.poster_path ? `https://image.tmdb.org/t/p/w200${recommendation.poster_path}` : placeholderImage"
              :alt="recommendation.title"
              class="recommendation-poster"
            />
            <p class="recommendation-title">{{ recommendation.title }}</p>
          </a>
        </div>
      </div>
    </div>

    <!-- Streaming Links -->
    <StreamingLinks :movieId="movie.id" />
  </div>

  <!-- Loading State -->
  <div class="loading" v-else>
    <p>Loading movie details...</p>
  </div>
</template>

<script>
import StreamingLinks from "@/components/StreamingLinks.vue";

export default {
  name: "Details",
  components: {
    StreamingLinks,
  },
  data() {
    return {
      movie: null,
      credits: null,
      recommendations: [],
    };
  },
  computed: {
    posterUrl() {
      return this.movie?.poster_path
        ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image";
    },
    genreString() {
      return this.movie?.genres
        ? this.movie.genres.map((genre) => genre.name).join(", ")
        : "N/A";
    },
    formattedBudget() {
      return this.movie?.budget
        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(this.movie.budget)
        : "N/A";
    },
    formattedRevenue() {
      return this.movie?.revenue
        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(this.movie.revenue)
        : "N/A";
    },
    placeholderImage() {
      return "https://via.placeholder.com/200x300?text=No+Image";
    },
  },
  async created() {
    try {
      const movieId = this.$route.params.id;

      // Fetch movie details, credits, and recommendations
      const [movieResponse, creditsResponse, recommendationsResponse] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
        ),
      ]);

      if (!movieResponse.ok || !creditsResponse.ok || !recommendationsResponse.ok) {
        throw new Error("Failed to fetch movie details, credits, or recommendations.");
      }

      this.movie = await movieResponse.json();
      this.credits = await creditsResponse.json();
      this.recommendations = (await recommendationsResponse.json()).results || [];
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  },
  methods: {
    castImageUrl(path) {
      return `https://image.tmdb.org/t/p/w200${path}`;
    },
  },
};
</script>

<style scoped>
/* ==============================
   Main Details Container
============================== */
.details {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 1s ease-out;
  background: linear-gradient(145deg, #fdfbfb, #ebedee); /* Subtle gradient */
  border-radius: var(--radius-lg);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  max-width: 1200px;
  margin: auto;
  overflow: hidden;
}

/* ==============================
   Header Section
============================== */
.details-header {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 1rem 0;
}

.movie-poster {
  width: 320px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-poster:hover {
  transform: scale(1.05);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.movie-header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.movie-title {
  font-size: 3.5rem;
  font-weight: bold;
  color: #2c3e50; /* Dark Blue */
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  margin-bottom: 0.5rem;
}

.movie-tagline {
  font-size: 1.6rem;
  font-style: italic;
  color: #7f8c8d; /* Muted Gray */
  margin-bottom: 1.5rem;
}

.movie-header-info p {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #34495e; /* Subtle Blue-Grey */
}

.genre-link,
.company-link {
  color: #2980b9; /* Bright Blue */
  font-weight: bold;
  text-decoration: none;
}

.genre-link:hover,
.company-link:hover {
  text-decoration: underline;
  color: #1f618d; /* Darker Blue */
}

/* ==============================
   Overview and Details
============================== */
.movie-info {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95); /* Slightly transparent white */
  border-radius: var(--radius-md);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.movie-info:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.movie-info h3 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #34495e;
  border-bottom: 2px solid #e74c3c; /* Red accent */
  display: inline-block;
}

.movie-info p {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #34495e;
  margin-bottom: 1rem;
}

/* ==============================
   Credits Section
============================== */
.credits {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 2rem;
}

.credits-section {
  flex: 1;
}

.credits-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  justify-content: center;
}

.credits-item {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-md);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.credits-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
}

.credits-photo {
  width: 140px;
  height: 200px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.credits-name {
  font-weight: bold;
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.credits-name a {
  text-decoration: none;
  color: inherit;
}

.credits-name a:hover {
  text-decoration: underline;
  color: #2980b9;
}

.credits-role {
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* ==============================
   Recommendations Section
============================== */
.movie-recommendations {
  margin-top: 2rem;
  padding-top: 1rem;
}

.recommendations-list {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.recommendation-item {
  flex-shrink: 0;
  width: 150px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-md);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.recommendation-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.recommendation-poster {
  width: 100%;
  border-radius: var(--radius-md);
  margin-bottom: 0.5rem;
}

.recommendation-title {
  font-size: 1rem;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 0.5rem;
}

/* ==============================
   Responsive Design
============================== */
@media (max-width: 1024px) {
  .details-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .movie-poster {
    width: 250px;
  }

  .movie-title {
    font-size: 2.8rem;
  }

  .movie-tagline {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .movie-poster {
    width: 200px;
  }

  .movie-title {
    font-size: 2.5rem;
  }

  .credits-list {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .credits-photo {
    width: 100px;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .movie-poster {
    width: 150px;
  }

  .movie-title {
    font-size: 2rem;
  }

  .credits-photo {
    width: 80px;
    height: 120px;
  }

  .recommendations-list {
    gap: 1rem;
  }
}

/* ==============================
   Animations
============================== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>