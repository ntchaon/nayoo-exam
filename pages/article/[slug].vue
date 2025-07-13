<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div v-if="ui.isLoading" class="text-center text-gray-500">
      กำลังโหลดบทความ...
    </div>

    <div v-else-if="article">
      <img
        v-if="article.coverUrl"
        :src="article.coverUrl"
        alt="cover"
        class="w-full max-h-[400px] object-cover rounded mb-6"
      />

      <h1 class="text-3xl font-bold mb-2">{{ article.title }}</h1>

      <p class="text-sm text-gray-500 mb-3">
        หมวด: {{ article.category }} | Views: {{ article.views || 0 }}
      </p>

      <p class="text-gray-700 italic mb-4">{{ article.description }}</p>

      <div
        class="prose max-w-none"
        v-html="article.content.replace(/\\n/g, '<br>')"
      />

      <!-- ✅ Tags -->
      <div v-if="article.tags?.length" class="mt-6">
        <h3 class="text-sm font-semibold text-gray-500 mb-2">แท็ก:</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in article.tags"
            :key="tag"
            class="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-4 mt-8">
        <button @click="toggleLike" class="text-sm">
          👍 {{ liked ? "เลิกถูกใจ" : "ถูกใจ" }}
        </button>
        <button @click="toggleBookmark" class="text-sm">
          📌 {{ bookmarked ? "เลิกบันทึก" : "บันทึก" }}
        </button>
        <div class="ml-auto flex gap-3 text-sm">
          <a
            :href="`https://www.facebook.com/sharer/sharer.php?u=${href}`"
            target="_blank"
            >Facebook</a
          >
          <a
            :href="`https://twitter.com/intent/tweet?url=${href}`"
            target="_blank"
            >Twitter</a
          >
          <a
            :href="`https://social-plugins.line.me/lineit/share?url=${href}`"
            target="_blank"
            >LINE</a
          >
        </div>
      </div>

      <div class="mt-10">
        <h3 class="text-lg font-semibold mb-2">ความคิดเห็น</h3>
        <textarea
          v-model="comment"
          placeholder="แสดงความคิดเห็น..."
          class="w-full border rounded p-2 mb-2"
        />
        <button
          @click="postComment"
          class="bg-blue-600 text-white px-4 py-1 rounded text-sm"
        >
          ส่งความคิดเห็น
        </button>

        <ul class="mt-4 space-y-2">
          <li
            v-for="(c, i) in comments"
            :key="i"
            class="bg-gray-100 p-2 rounded text-sm"
          >
            {{ c }}
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="text-center text-red-500">ไม่พบบทความนี้</div>
  </div>
</template>
<script setup lang="ts">
import { fullScreenLoading } from "@/stores/load";
import { useRoute, useRouter } from "vue-router";
import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useHead, useAsyncData, onMounted } from "#imports";
import { createFirebase } from "~/composables/firebase";
import { useRequestURL, useRuntimeConfig, navigateTo } from "nuxt/app";
type Article = {
  id: string;
  title: string;
  description: string;
  content: string;
  category?: string;
  coverUrl?: string;
  tags?: string[];
  views?: number;
  status?: string;
  slug?: string;
  isActive?: boolean;
  createdAt?: any; // หรือ Timestamp
};
const { firestore } = createFirebase();
const ui = fullScreenLoading();
const route = useRoute();
const router = useRouter();
const { href } = useRequestURL();
const slug = route.params.slug as string;

const liked = ref(false);
const bookmarked = ref(false);
const comment = ref("");
const comments = ref<string[]>([]);

const { data: articleData } = await useAsyncData<Article | null>(
  `article-${slug}`,
  async () => {
    const q = query(
      collection(firestore, "articles"),
      where("slug", "==", slug),
      where("status", "==", "published"),
      where("isActive", "==", true)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const docSnap = snap.docs[0];
    const rawData = docSnap.data();
    const pojo = JSON.parse(JSON.stringify(rawData)) as Omit<Article, "id">;
    return {
      id: docSnap.id,
      ...pojo,
    };
  }
);

if (!articleData.value) {
  if (process.client) router.push("/articles");
  else navigateTo("/articles");
}

const article = computed(() => articleData.value);
const articleId = computed(() => article.value?.id || "");

if (article.value) {
  useHead({
    title: article.value.title,
    meta: [
      { name: "description", content: article.value.description },
      { name: "keywords", content: article.value.tags?.join(", ") || "" },
      { name: "author", content: "ชื่อผู้เขียนหรือแบรนด์" },

      { property: "og:title", content: article.value.title },
      { property: "og:description", content: article.value.description },
      {
        property: "og:image",
        content: article.value.coverUrl || "/fallback.jpg",
      },
      { property: "og:url", content: href },
      { property: "og:type", content: "article" },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: article.value.title },
      { name: "twitter:description", content: article.value.description },
      {
        name: "twitter:image",
        content: article.value.coverUrl || "/fallback.jpg",
      },
    ],
  });
}

onMounted(async () => {
  ui.stopLoading();

  if (articleId.value) {
    const stored = localStorage.getItem(`comments-${articleId.value}`);
    comments.value = stored ? JSON.parse(stored) : [];

    liked.value = localStorage.getItem(`like-${articleId.value}`) === "1";
    bookmarked.value =
      localStorage.getItem(`bookmark-${articleId.value}`) === "1";


    const articleRef = doc(firestore, "articles", articleId.value);
    await updateDoc(articleRef, {
      views: increment(1),
    });
  }
});

function toggleLike() {
  liked.value = !liked.value;
  localStorage.setItem(`like-${articleId.value}`, liked.value ? "1" : "0");
}

function toggleBookmark() {
  bookmarked.value = !bookmarked.value;
  localStorage.setItem(
    `bookmark-${articleId.value}`,
    bookmarked.value ? "1" : "0"
  );
}

function postComment() {
  if (comment.value.trim()) {
    comments.value.push(comment.value.trim());
    localStorage.setItem(
      `comments-${articleId.value}`,
      JSON.stringify(comments.value)
    );
    comment.value = "";
  }
}
</script>
