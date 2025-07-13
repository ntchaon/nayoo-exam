<template>
  <div
    class="relative w-full max-h-[400px] rounded mb-2 overflow-hidden"
    :class="class"
  >
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-gray-200 animate-pulse z-0"
    ></div>

    <img
      v-if="props.src"
      :src="props.src"
      :alt="alt"
      class="w-full h-full object-cover z-10"
      @load="isLoading = false"
      @error="isLoading = false"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string | null;
  alt: string;
  class?: string | null | undefined;
}>();
const isLoading = ref(true);
</script>
