<template>
  <BaseCard
    @click="$router.push(`/article/${props.slug}`)"
    class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition p-4 flex flex-col space-y-2 justify-between"
  >
    <div>
      <BaseImage
        :src="props.coverUrl || null"
        alt="article cover image"
        class="h-32"
      />
      <h2 class="text-lg font-semibold line-clamp-1">
        {{ props.title }}
      </h2>
      <p class="text-sm text-gray-600 line-clamp-2">
        {{ props.description }}
      </p>
    </div>
    <div>
      <div class="text-xs text-gray-400 mt-auto">
        หมวดหมู่: {{ props.category }}
      </div>
      <div
        class="text-xs text-gray-400 mt-auto"
        v-if="props.tags && props.tags.length"
      >
        แท็ก: {{ props.tags?.join(",") }}
      </div>
      <div class="text-xs text-gray-400 mt-auto">
        จำนวนการดู: {{ props.views || 0 }}
      </div>
    </div>
  </BaseCard>
</template>
<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
  category?: string;
  coverUrl?: string | null;
  slug?: string;
  tags?: string[];
  views?: number;
}>();
</script>
