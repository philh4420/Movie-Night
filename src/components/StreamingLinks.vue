<template>
  <div class="streaming-links">
    <h3 class="streaming-title">Available on:</h3>

    <!-- Show Platforms -->
    <div v-if="platforms.length" class="platform-list">
      <div
        v-for="platform in platforms"
        :key="platform.provider_id"
        class="platform-item"
      >
        <img
          :src="`https://image.tmdb.org/t/p/w500${platform.logo_path}`"
          :alt="`${platform.provider_name} logo`"
          class="platform-logo"
        />
        <span class="platform-name">{{ platform.provider_name }}</span>
      </div>
    </div>

    <!-- Fallback for No Providers -->
    <p v-else-if="!loading" class="no-providers">
      No streaming information available for your region.
    </p>

    <!-- Loading State -->
    <div v-if="loading" class="loading-message">
      Fetching streaming information...
    </div>
  </div>
</template>

<script>
export default {
  name: "StreamingLinks",
  props: {
    movieId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      platforms: [],
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchCountryCode() {
      try {
        const response = await fetch("https://ipinfo.io/json");
        if (!response.ok) throw new Error("Failed to fetch country code");
        const data = await response.json();
        return data.country;
      } catch (error) {
        console.error("Error fetching user location:", error);
        return "US"; // Fallback to US
      }
    },
    async fetchStreamingProviders(country) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${this.movieId}/watch/providers?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );
        if (!response.ok) throw new Error("Failed to fetch streaming providers");

        const data = await response.json();
        if (data.results && data.results[country]) {
          this.platforms = data.results[country].flatrate || [];
        }
      } catch (error) {
        this.error = "Failed to fetch streaming providers.";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    this.loading = true;
    try {
      const countryCode = await this.fetchCountryCode();
      console.log("Detected Country:", countryCode);
      await this.fetchStreamingProviders(countryCode);
    } catch (error) {
      console.error("Initialization Error:", error);
      this.error = "Unable to fetch streaming information.";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
/* Streaming Links Container */
.streaming-links {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: var(--color-card-bg, #f8f9fa);
  border-radius: var(--radius-lg, 8px);
  box-shadow: var(--shadow-md, 0 4px 8px rgba(0, 0, 0, 0.1));
  animation: fadeIn 0.5s ease-in-out;
}

/* Title */
.streaming-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--color-primary, #4f46e5);
  text-align: center;
}

/* Platform List */
.platform-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

/* Individual Platform Item */
.platform-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  padding: 1rem;
  width: 100px;
  background-color: var(--color-white, #fff);
  border-radius: var(--radius-md, 6px);
  box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.platform-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg, 0 6px 12px rgba(0, 0, 0, 0.15));
}

/* Platform Logo */
.platform-logo {
  width: 50px;
  height: auto;
  border-radius: var(--radius-sm, 4px);
  box-shadow: var(--shadow-sm);
}

/* Platform Name */
.platform-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--color-text-primary, #333);
}

/* No Providers Message */
.no-providers {
  text-align: center;
  font-size: 1rem;
  color: var(--color-text-secondary, #999);
  margin-top: 1rem;
  font-style: italic;
}

/* Loading Message */
.loading-message {
  text-align: center;
  font-size: 1rem;
  color: var(--color-text-secondary, #555);
  margin-top: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .platform-item {
    width: 80px;
  }

  .platform-logo {
    width: 40px;
  }

  .platform-name {
    font-size: 0.8rem;
  }
}

/* Fade-in Animation */
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