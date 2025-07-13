<template>
  <BaseCard
    @click="$router.push(`/article/${props.slug}`)"
    class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition p-4"
  >
    <h2 class="text-lg font-semibold text-blue-700">
      {{ props.title }}
    </h2>
    <p class="text-sm text-gray-600 line-clamp-3">
      {{ props.description }}
    </p>
    <div class="text-xs text-gray-400 mt-auto">
      หมวดหมู่: {{ props.category }}
    </div>
    <div
      class="text-xs text-gray-400 mt-auto"
      v-if="props.tags && props.tags.length"
    >
      Tags: {{ props.tags?.join(",") }}
    </div>
  </BaseCard>
</template>
<script setup lang="ts">
const props = defineProps({
  title: String,
  description: String,
  category: String,
  slug: String,
  tags: {
    type: Array as () => string[],
    default: () => [],
  },
});
</script>
