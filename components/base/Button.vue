<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center px-4 py-2 rounded font-medium transition focus:outline-none"
    :class="[
      variantClass,
      disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
    ]"
  >
    <span v-if="loading" class="loader mr-2" />
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "info" | "warning" | "link";
  disabled?: boolean;
  loading?: boolean;
}>();

const variantClass = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white";
    case "danger":
      return "bg-red-600 text-white hover:bg-red-700";
    case "info":
      return "bg-sky-300 text-white hover:bg-sky-500";
    case "warning":
      return "bg-yellow-500 text-white hover:bg-yellow-600";
    case "link":
      return "text-blue-600 hover:underline";
    default:
      return "bg-blue-600 text-white hover:bg-blue-700";
  }
});
</script>

<style scoped>
.loader {
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 9999px;
  width: 1em;
  height: 1em;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
