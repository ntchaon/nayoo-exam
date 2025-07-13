<template lang="">
  <div v-if="relatedArticles.length" class="mt-10">
    <h2 class="text-xl font-bold mb-4">บทความที่เกี่ยวข้อง</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <BaseArticleCard
        v-for="article in relatedArticles"
        :key="article.id"
        :title="article.title"
        :coverUrl="article.coverUrl"
        :description="article.description"
        :category="article.category"
        :slug="article.slug"
        :tags="article.tags"
        :views="article.views"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { createFirebase } from "@/composables/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import type { ArticleType } from "~/types";

const props = defineProps<{
  article?: ArticleType | null;
}>();

const relatedArticles = ref<ArticleType[]>([]);
const { firestore } = createFirebase();

onMounted(async () => {
  console.log(props.article);
  if (!props.article) return;

  const q = query(
    collection(firestore, "articles"),
    where("isActive", "==", true),
    where("status", "==", "published")
  );

  const snap = await getDocs(q);

  const all: ArticleType[] = snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as ArticleType))
    .filter((doc) => doc.id !== props.article?.id);
  console.log(all);
  relatedArticles.value = all
    .filter((doc) => {
      const sameCategory = doc.category === props.article?.category;
      const sharedTags = doc.tags?.some((tag) =>
        props.article?.tags?.includes(tag)
      );
      return sameCategory || sharedTags;
    })
    .slice(0, 4);
});
</script>

<style lang=""></style>
