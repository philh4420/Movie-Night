<template>
  <div class="poll-results">
    <div v-for="(option, index) in pollOptions" :key="option.id" class="poll-result">
      <!-- Movie Title & Percentage -->
      <div class="poll-result-info">
        <strong class="poll-option-name">{{ option.title }}</strong>
        <span class="poll-result-percentage">{{ votePercentage(index) }}%</span>
      </div>

      <!-- Movie Metadata -->
      <small class="movie-meta">
        📅 {{ option.release_date ? option.release_date.slice(0, 4) : "N/A" }}  
        • ⏳ {{ option.runtime !== undefined ? option.runtime + " min" : "N/A" }}
      </small>
      <span class="genres">🏷 {{ getGenreNames(option.genres) }}</span>

      <!-- Progress Bar for Voting -->
      <ProgressBar :percentage="votePercentage(index)" />
    </div>
  </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar.vue";
import { genreMap } from "@/utils/genreMap";

export default {
  name: "PollResults",
  components: {
    ProgressBar,
  },
  props: {
    pollOptions: {
      type: Array,
      required: true,
    },
    pollVotes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    votePercentage(index) {
      const totalVotes = this.pollVotes.reduce((sum, count) => sum + count, 0);
      return totalVotes === 0 ? 0 : ((this.pollVotes[index] / totalVotes) * 100).toFixed(1);
    },
    getGenreNames(genreIds) {
      if (!Array.isArray(genreIds) || genreIds.length === 0) return "Unknown"; // ✅ Prevent Errors
      return genreIds.map((id) => genreMap[id] || "Unknown").join(", ");
    },
  },
};
</script>

<style scoped>
/* Poll Results Container */
.poll-results {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* Poll Result Info: Title & Percentage */
.poll-result-info {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-text-primary);
}

/* Movie Metadata */
.movie-meta {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 5px;
}

/* Genre Tags */
.genres {
  font-size: 0.85rem;
  color: var(--color-text-accent);
  font-style: italic;
}
</style>