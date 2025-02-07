<template>
  <div id="app">
    <!-- Use DefaultLayout as the global wrapper -->
    <DefaultLayout>
      <!-- Render pages dynamically with Vue Router -->
      <router-view />
    </DefaultLayout>
  </div>
</template>

<script>
import DefaultLayout from "./layouts/DefaultLayout.vue";

export default {
  name: "App",
  components: {
    DefaultLayout,
  },
};
</script>

<style>
/* Global Styles for App.vue */
#app {
  font-family: "Arial", sans-serif;
  color: #333;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9fafb; /* Light background for global consistency */
}

body {
  margin: 0;
  padding: 0;
}
</style>