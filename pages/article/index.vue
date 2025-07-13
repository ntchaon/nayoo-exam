<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">บทความทั้งหมด</h1>
      <div class="w-1/3">
        <BaseSelect v-model="sortBy">
          <option value="createdAt">ใหม่ล่าสุด</option>
          <option value="views">ยอดนิยม</option>
        </BaseSelect>
      </div>
    </div>

    <BaseLoadingSpinner v-if="ui.isLoading" />

    <div v-else-if="articles.length === 0" class="text-center text-gray-500">
      ยังไม่มีบทความที่เผยแพร่
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseArticleCard
        v-for="article in articles"
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
import { fullScreenLoading } from "@/stores/load";
import { createFirebase } from "~/composables/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import type { ArticleType } from "~/types";

const { firestore } = createFirebase();
const ui = fullScreenLoading();
const articles = ref<ArticleType[]>([]);
const sortBy = ref<"createdAt" | "views">("createdAt");

async function fetchArticles() {
  ui.startLoading();
  const q = query(
    collection(firestore, "articles"),
    where("status", "==", "published"),
    where("isActive", "==", true),
    orderBy(sortBy.value, "desc")
  );

  const snap = await getDocs(q);
  if (!snap.empty) {
    articles.value = snap.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as ArticleType)
    );
  } else {
    articles.value = [];
  }
  ui.stopLoading();
}

watch(sortBy, fetchArticles, { immediate: true });
</script>
