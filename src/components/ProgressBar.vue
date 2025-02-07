<template>
  <div class="poll-progress-bar">
    <div 
      class="poll-progress-bar-fill" 
      :style="{ width: percentage + '%' }" 
      :aria-valuenow="percentage" 
      aria-valuemin="0" 
      aria-valuemax="100" 
      role="progressbar"
    >
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    percentage: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
/* ✅ Progress Bar Container */
.poll-progress-bar {
  width: 100%; /* Full width for adaptability */
  height: 12px; /* Slightly taller for modern design */
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xs);
  overflow: hidden;
  position: relative;
}

/* ✅ Progress Bar Fill */
.poll-progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  transition: width 0.4s ease, background-color 0.3s ease; /* Smooth transitions */
  border-radius: var(--radius-xs); /* Rounded edges for a seamless look */
  position: absolute;
}

/* ✅ Accessibility Focus State */
.poll-progress-bar-fill:focus {
  outline: 2px solid var(--color-primary-hover);
  outline-offset: 2px;
}
</style>