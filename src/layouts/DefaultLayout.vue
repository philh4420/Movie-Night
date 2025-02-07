<template>
  <div class="layout">
    <!-- Header -->
    <header class="layout-header">
      <nav class="nav container">
        <!-- Logo -->
        <h1 class="logo">
          <router-link to="/">🎬 Movie Night Planner</router-link>
        </h1>

        <!-- Navigation Links -->
        <ul class="nav-links">
          <li>
            <router-link
              to="/"
              class="nav-link"
              active-class="active-link"
              exact
            >
              Home
            </router-link>
          </li>
          <li>
            <router-link
              to="/poll"
              class="nav-link"
              active-class="active-link"
            >
              Poll
            </router-link>
          </li>
          <li>
            <router-link
              to="/about"
              class="nav-link"
              active-class="active-link"
            >
              About
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="layout-content container">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="layout-footer">
      <div class="container footer-container">
        <p class="footer-text">
          © 2025 Movie Night Planner. All rights reserved.
        </p>
        <p class="footer-powered">
          Powered by
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            >TMDB</a
          >
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "DefaultLayout",
};
</script>

<style scoped>
/* General Layout */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg, #f8f9fa);
  color: var(--color-text-primary, #333);
}

/* Header */
.layout-header {
  background: var(--color-header-bg, #4f46e5);
  color: var(--color-header-text, #fff);
  box-shadow: var(--shadow-header, 0 4px 8px rgba(0, 0, 0, 0.1));
  animation: slideDown 0.5s ease-in-out;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Logo */
.logo {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-logo, #fff);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, color 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
  color: var(--color-logo-hover, #818cf8);
}

/* Navigation Links */
.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
}

.nav-link {
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  color: var(--color-header-text, #fff);
  position: relative;
  transition: color 0.3s ease, transform 0.3s ease;
}

.nav-link:hover {
  color: var(--color-link-hover, #c7d2fe);
  transform: translateY(-2px); /* Slight hover effect */
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-link-hover, #c7d2fe);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.active-link {
  color: var(--color-active-link, #c7d2fe);
  font-weight: bold;
  text-decoration: underline;
}

/* Main Content */
.layout-content {
  flex: 1;
  padding: 2.5rem 1rem;
  background: var(--color-content-bg, #ffffff);
  color: var(--color-content-text, #333);
  line-height: 1.8;
  animation: fadeIn 0.5s ease-in-out;
  border-radius: var(--radius-lg, 12px); /* Rounded edges for modern design */
  box-shadow: var(--shadow-lg, 0 4px 8px rgba(0, 0, 0, 0.1)); /* Subtle shadow for depth */  
  margin: 0 auto;
}

/* Footer */
.layout-footer {
  background: var(--color-footer-bg, #4f46e5);
  color: var(--color-footer-text, #fff);
  padding: 1.5rem 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.footer-text {
  font-size: 0.95rem;
  margin: 0;
}

.footer-powered a {
  color: var(--color-footer-link, #c7d2fe);
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.footer-powered a:hover {
  color: var(--color-footer-link-hover, #818cf8);
  text-decoration: underline;
}

/* Animations */
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

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-links {
    gap: 1rem;
  }

  .logo {
    font-size: 1.5rem;
  }

  .layout-content {
    padding: 2rem 1rem;
  }

  .footer-text {
    font-size: 0.85rem;
  }
}
</style>