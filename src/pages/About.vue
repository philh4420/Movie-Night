<template>
  <div class="about-page">
    <!-- Page Header -->
    <h1 class="about-title">About Movie Night Planner</h1>

    <!-- Mission Section -->
    <section class="about-section">
      <h2 class="section-title">🎯 Our Mission</h2>
      <p class="section-text">
        Welcome to <strong>Movie Night Planner</strong>! Our mission is to make choosing movies for your next movie night effortless and enjoyable. Whether you’re planning a group hangout or a quiet evening alone, we bring the best movie recommendations right to your fingertips.
      </p>
    </section>

    <!-- Features Section -->
    <section class="about-section">
      <h2 class="section-title">✨ Features</h2>
      <ul class="features-list">
        <li>🎥 Browse popular movies and upcoming releases.</li>
        <li>🗳️ Vote on what to watch with friends.</li>
        <li>🔍 Search for specific movies or genres.</li>
        <li>📊 Track polls and see what’s trending.</li>
        <li>🌟 Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener">TMDB API</a>.</li>
      </ul>
    </section>

    <!-- Technology Section -->
    <section class="about-section">
      <h2 class="section-title">🛠️ Technology Stack</h2>
      <p class="section-text">
        Movie Night Planner is built with modern web technologies for a seamless experience:
      </p>
      <ul class="tech-list">
        <li>Vue.js 3: A progressive JavaScript framework.</li>
        <li>Vuex: State management for seamless app interactions.</li>
        <li>Firebase: Real-time database for poll tracking.</li>
        <li>TMDB API: A powerful database of movies and TV shows.</li>
        <li>SCSS: For modern, responsive styling.</li>
      </ul>
    </section>

    <!-- Acknowledgements Section -->
    <section class="about-section">
      <h2 class="section-title">🙏 Acknowledgements</h2>
      <p class="section-text">
        We’d like to thank:
      </p>
      <ul class="acknowledgements-list">
        <li>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener">The Movie Database (TMDB)</a>
          for providing the data that powers this app.
        </li>
        <li>Open-source libraries like Axios, Vue Router, and more.</li>
        <li>Our amazing users who inspire us to keep improving.</li>
      </ul>
    </section>

    <!-- Contact Section -->
    <section class="about-section">
      <h2 class="section-title">📬 Get in Touch</h2>
      <p class="section-text">
        Have feedback or questions? We’d love to hear from you! Feel free to reach out via email:
        <a href="mailto:info@phils-portfolio.co.uk">info@phils-portfolio.co.uk</a>.
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: "About",
};
</script>

<style scoped>
/* Main Container */
.about-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  color: var(--color-text-primary, #333);
  background-color: var(--color-bg, #ffffff);
  border-radius: var(--radius-lg, 12px);
  box-shadow: var(--shadow-md, 0 4px 8px rgba(0, 0, 0, 0.1));
}

/* Title */
.about-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: var(--color-primary, #4f46e5);
  margin-bottom: 2rem;
}

/* Section Styling */
.about-section {
  margin-bottom: 2rem;
  padding: 1rem 0;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--color-secondary, #6366f1);
  margin-bottom: 1rem;
  text-align: center;
}

.section-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--color-text-secondary, #555);
  margin-bottom: 1.5rem;
  text-align: justify;
}

/* Lists */
.features-list,
.tech-list,
.acknowledgements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li,
.tech-list li,
.acknowledgements-list li {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-primary, #333);
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1.5rem;
}

.features-list li::before,
.tech-list li::before,
.acknowledgements-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--color-primary, #4f46e5);
  font-size: 1.2rem;
  line-height: 1;
}

/* Links */
a {
  color: var(--color-primary, #4f46e5);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--color-primary-hover, #6366f1);
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .about-page {
    padding: 1.5rem;
  }

  .about-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-text {
    font-size: 1rem;
  }
}
</style>