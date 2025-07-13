<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <h1 class="text-2xl font-bold mb-6">บทความทั้งหมด</h1>

    <div v-if="ui.isLoading" class="text-center text-gray-500">
      กำลังโหลดบทความ...
    </div>

    <div v-else-if="articles.length === 0" class="text-center text-gray-500">
      ยังไม่มีบทความที่เผยแพร่
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseArticleCard
        v-for="article in articles"
        :key="article.id"
        :title="article.title"
        :description="article.description"
        :category="article.category"
        :slug="article.slug"
        :tags="article.tags"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { fullScreenLoading } from "@/stores/load";

import { createFirebase } from "~/composables/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
const { firestore } = createFirebase();
const articles = ref<any[]>([]);

const ui = fullScreenLoading();
onMounted(async () => {
  ui.startLoading();
  const q = query(
    collection(firestore, "articles"),
    where("status", "==", "published"),
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  if (!snap.empty) {
    articles.value = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
  ui.stopLoading();
});
</script>
