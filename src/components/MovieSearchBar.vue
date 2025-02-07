<template>
  <div class="movie-search-bar">
    <!-- Search Input -->
    <input
      type="text"
      class="input search-input"
      placeholder="Search for a movie..."
      v-model="searchQuery"
      @keydown.enter="onSearch"
      aria-label="Search for a movie"
    />
    <!-- Search Button -->
    <button
      class="button search-button"
      :disabled="!searchQuery.trim()"
      @click="onSearch"
      aria-label="Search button"
    >
      Search
    </button>
  </div>
</template>

<script>
export default {
  name: "MovieSearchBar",
  emits: ["search"], // Emits a 'search' event to the parent
  data() {
    return {
      searchQuery: "", // User input for the search query
    };
  },
  methods: {
    onSearch() {
      const query = this.searchQuery.trim();
      this.$emit("search", query); // Emit the search query to the parent
    },
  },
};
</script>

<style scoped>
/* Container */
.movie-search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--color-card-bg, #f8f9fa); /* Fallback background color */
  border-radius: var(--radius-lg, 8px);
  box-shadow: var(--shadow-md, 0 4px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-search-bar:hover {
  box-shadow: var(--shadow-lg, 0 6px 12px rgba(0, 0, 0, 0.15));
  transform: translateY(-2px);
}

/* Input Field */
.search-input {
  flex: 1;
  max-width: 500px;
  padding: 1rem;
  font-size: 1rem;
  color: var(--color-text-primary, #333);
  background: var(--color-input-bg, #fff);
  border: 2px solid var(--color-input-border, #ddd);
  border-radius: var(--radius-md, 6px);
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input::placeholder {
  color: var(--color-text-secondary, #999);
}

.search-input:focus {
  border-color: var(--color-primary, #4f46e5);
  box-shadow: 0 0 10px var(--color-primary, #4f46e5);
}

/* Search Button */
.search-button {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color-white, #fff);
  background: var(--gradient-primary, linear-gradient(135deg, #4f46e5, #6366f1));
  border: none;
  border-radius: var(--radius-md, 6px);
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}

.search-button:hover:not(:disabled) {
  background: var(--gradient-primary-hover, linear-gradient(135deg, #6366f1, #818cf8));
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover, 0 6px 12px rgba(0, 0, 0, 0.2));
}

.search-button:disabled {
  background: var(--color-disabled-bg, #e0e0e0);
  color: var(--color-disabled-text, #999);
  cursor: not-allowed;
  box-shadow: none;
}
</style>