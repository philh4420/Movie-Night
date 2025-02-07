<template>
  <div class="movie-grid">
    <MovieCard
      v-for="movie in movies"
      :key="movie.id"
      :title="movie.title"
      :posterPath="movie.poster_path"
      :rating="movie.vote_average"
      :genres="movie.genres"
      :releaseDate="movie.release_date"
      @movie-selected="handleMovieSelection(movie)"
    />
  </div>
</template>

<script>
import MovieCard from "@/components/MovieCard.vue";

export default {
  components: {
    MovieCard,
  },
  data() {
    return {
      movies: [
        {
          id: 1,
          title: "The Dark Knight",
          poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
          vote_average: 8.4,
          genres: ["Action", "Crime", "Drama"],
          release_date: "2008-07-16",
        },
        // Add more movie objects here...
      ],
    };
  },
  methods: {
    handleMovieSelection(movie) {
      console.log("Selected movie:", movie);
      // Navigate to the movie details page or trigger another action
    },
  },
};
</script>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
}
</style>