<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you're looking for doesn't exist.</p>
    <router-link to="/">Go back to Home</router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 2rem;
}

.not-found h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.not-found p {
  margin-bottom: 1rem;
}

.not-found a {
  color: #2563eb; /* Blue */
  text-decoration: none;
  font-weight: bold;
}

.not-found a:hover {
  text-decoration: underline;
}
</style>