<template>
  <div class="poll">
    <!-- Page Title -->
    <h2 class="page-title">🎥 Movie Night Poll</h2>
    <p class="poll-description">
      Vote for the movie you want to watch tonight! Your vote matters. 🚀
    </p>

    <!-- Poll Widget -->
    <div class="poll-widget-container">
      <PollWidget
        title="What should we watch tonight?"
        @reset="handleResetPoll"
      />
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-spinner">
      <span>Loading poll data...</span>
    </div>

    <!-- Poll Data -->
    <div class="poll-data" v-if="pollOptions.length && !loading">
      <h3 class="poll-data-title">Current Poll Results</h3>
      <div class="poll-results-grid">
        <div
          v-for="(option, index) in pollOptions"
          :key="index"
          class="poll-result-card"
        >
          <h4 class="poll-option-title">{{ option.title }}</h4>
          <img
            v-if="option.poster_path"
            :src="`https://image.tmdb.org/t/p/w200${option.poster_path}`"
            :alt="`Poster for ${option.title}`"
            class="poll-option-poster"
          />
          <p class="poll-result-percentage">{{ votePercentage(index) }}%</p>
          <div class="poll-progress-bar">
            <div
              class="poll-progress-bar-fill"
              :style="{ width: `${votePercentage(index)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PollWidget from "@/components/PollWidget.vue";

export default {
  name: "Poll",
  components: {
    PollWidget,
  },
  data() {
    return {
      loading: true, // State for loading spinner
    };
  },
  computed: {
    ...mapGetters("polls", ["pollOptions", "pollVotes"]),
    votePercentage() {
      return (optionIndex) => {
        const totalVotes = this.pollVotes.reduce((sum, count) => sum + count, 0);
        return totalVotes === 0
          ? 0
          : ((this.pollVotes[optionIndex] / totalVotes) * 100).toFixed(1);
      };
    },
  },
  methods: {
    ...mapActions("polls", ["loadPoll", "resetPoll"]),
    async handleResetPoll() {
      this.loading = true; // Show loading spinner during reset
      await this.resetPoll(); // Reset poll and fetch fresh options
      this.loading = false; // Hide loading spinner
    },
  },
  async mounted() {
    await this.loadPoll(); // Load the poll from Firebase when the page loads
    this.loading = false; // Hide loading spinner after loading data
  },
};
</script>

<style scoped>
/* Poll Page Styles */
.poll {
  padding: 2rem;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  animation: fadeIn 0.5s ease-in-out;
}

/* Title */
.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

/* Description */
.poll-description {
  text-align: center;
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Poll Widget */
.poll-widget-container {
  margin-bottom: 2rem;
}

/* Loading Spinner */
.loading-spinner {
  text-align: center;
  font-size: 1.2rem;
  color: var(--color-primary);
  margin: 2rem 0;
}

/* Poll Data */
.poll-data {
  padding: 1.5rem;
  background-color: var(--color-card-bg, #f8f9fa);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  animation: fadeIn 0.5s ease-in-out;
}

.poll-data-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
}

/* Poll Results Grid */
.poll-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

/* Individual Poll Result Card */
.poll-result-card {
  padding: 1rem;
  background-color: var(--color-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.poll-result-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.poll-option-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
}

.poll-option-poster {
  width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
}

.poll-result-percentage {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
}

/* Poll Progress Bar */
.poll-progress-bar {
  height: 12px;
  background-color: var(--color-disabled-bg, #e0e0e0);
  border-radius: var(--radius-xs);
  overflow: hidden;
}

.poll-progress-bar-fill {
  height: 100%;
  background-color: var(--color-primary, #4f46e5);
  transition: width 0.3s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .poll {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .poll-description {
    font-size: 1rem;
  }

  .poll-result-card {
    font-size: 0.9rem;
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