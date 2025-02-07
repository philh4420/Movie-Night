<template>
  <div class="poll-widget card">
    <!-- Poll Title -->
    <h3 class="poll-title text-center">{{ title }}</h3>

    <!-- Loading & Error Handling -->
    <div v-if="loading" class="poll-message loading">Loading poll data...</div>
    <div v-else-if="error" class="poll-message error">
      Error loading poll. Please try again later.
    </div>

    <!-- Poll Options -->
    <div v-else class="poll-options">
      <button
        v-for="(option, index) in pollOptions"
        :key="option.id"
        class="poll-option"
        @click="castVote(index)"
      >
        <!-- Movie Poster -->
        <img
          class="poll-movie-poster"
          :src="`https://image.tmdb.org/t/p/w200${option.poster_path}`"
          alt="Movie Poster"
        />

        <!-- Movie Info -->
        <div class="poll-option-content">
          <h4 class="movie-title">{{ option.title }}</h4>
          <p class="movie-meta">
            {{ option.release_date.slice(0, 4) }} • {{ option.runtime || "N/A" }} min
          </p>
          <div class="genre-tags">
            <span
              v-for="genre in getGenreNames(option.genres)"
              :key="genre"
              class="genre-tag"
            >
              {{ genre }}
            </span>
          </div>
        </div>
      </button>
    </div>

    <!-- Reset Button -->
    <div class="poll-footer">
      <button class="reset-button" @click="handleResetPoll">Reset Poll</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { genreMap } from "@/utils/genreMap"; // Ensure this is correctly imported

export default {
  name: "PollWidget",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters("polls", ["pollOptions", "userVote", "loading", "error", "pollId"]),
  },
  methods: {
    ...mapActions("polls", ["voteInPoll", "resetPoll", "loadPoll"]),

    castVote(index) {
      if (this.userVote === null) {
        this.voteInPoll(index);
      }
    },

    getGenreNames(genreIds) {
      // Handle genres gracefully
      if (!Array.isArray(genreIds) || genreIds.length === 0) {
        return ["Unknown"];
      }
      return genreIds.map((id) => genreMap[id] || "Unknown");
    },

    async handleResetPoll() {
      await this.resetPoll();
      this.loadPoll(); // Reload the poll after resetting
    },
  },

  async mounted() {
    await this.loadPoll(); // Load poll when the component is mounted
  },
};
</script>

<style scoped>
/* Poll Widget */
.poll-widget {
  max-width: 1200px;
  margin: 2rem auto;
  padding: var(--space-lg);
  background: rgba(255, 255, 255, 0.2); /* Glass effect */
  backdrop-filter: blur(25px);
  border-radius: var(--radius-xl); /* Larger, more rounded corners */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.4);
  overflow: hidden;
  position: relative;
  animation: fadeIn 1s ease-out; /* Smooth fade-in on load */
}

/* Background Lighting Effect */
.poll-widget::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0)
  );
  animation: rotateBackground 10s linear infinite;
  z-index: -1;
}

/* Poll Title */
.poll-title {
  font-size: 2.6rem; /* Larger, more bold font */
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: var(--space-lg);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Modern shadow for text */
  animation: slideDown 0.8s ease-out; /* Slide-in animation */
}

/* Loading & Error Messages */
.poll-message {
  font-size: 1.3rem;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  background: rgba(0, 0, 0, 0.2); /* Subtle glassy background */
  color: var(--color-white);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.loading {
  color: var(--color-accent);
}

.error {
  color: var(--color-danger);
}

/* Poll Options (Horizontal Layout) */
.poll-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem; /* Increased spacing for clarity */
  animation: fadeInUp 1s ease-out; /* Staggered fade-in for poll items */
}

/* Poll Option */
.poll-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.15); /* Semi-transparent background */
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.poll-option:hover {
  transform: translateY(-10px); /* Lifts slightly on hover */
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.2);
}

/* Movie Poster */
.poll-movie-poster {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: var(--radius-md);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: var(--space-md);
  transition: transform 0.3s ease;
}

.poll-option:hover .poll-movie-poster {
  transform: scale(1.1); /* Subtle zoom on hover */
}

/* Movie Info */
.poll-option-content {
  text-align: center;
  color: var(--color-white);
}

.movie-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
  animation: fadeIn 1.2s ease-in; /* Fades in the title */
}

.movie-meta {
  font-size: 1rem;
  color: var(--color-text-secondary);
}

/* Genre Tags */
.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: var(--space-sm);
}

.genre-tag {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-white);
  padding: 6px 12px; /* Larger, more clickable tags */
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, background 0.3s ease;
}

.genre-tag:hover {
  transform: scale(1.1); /* Zooms slightly on hover */
  background: rgba(255, 255, 255, 0.3);
}

/* Footer (Reset Button) */
.poll-footer {
  margin-top: var(--space-lg);
}

.reset-button {
  font-size: 1.2rem;
  font-weight: 700;
  padding: var(--space-md) var(--space-lg);
  color: var(--color-white);
  background: linear-gradient(145deg, #ff6b6b, #ff4949);
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}

.reset-button:hover {
  transform: scale(1.1);
  background: linear-gradient(145deg, #ff4949, #ff6b6b);
  box-shadow: 0 10px 30px rgba(255, 77, 77, 0.4);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

@keyframes rotateBackground {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>