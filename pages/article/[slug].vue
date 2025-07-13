<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div v-if="ui.isLoading" class="text-center text-gray-500">
      กำลังโหลดบทความ...
    </div>

    <div v-else-if="article">
      <BaseImage :src="article.coverUrl || null" alt="article cover image" />

      <h1 class="text-3xl font-bold mb-2">{{ article.title }}</h1>

      <p class="text-sm text-gray-500 mb-3">
        หมวด: {{ article.category }} | Views: {{ article.views || 0 }}
      </p>

      <p class="text-gray-700 italic mb-4">{{ article.description }}</p>

      <div
        class="prose max-w-none"
        v-html="article.content.replace(/\\n/g, '<br>')"
      />

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
          {{ liked ? "เลิกถูกใจ" : "ถูกใจ" }}
        </button>
        <button @click="toggleBookmark" class="text-sm">
          {{ bookmarked ? "เลิกบันทึก" : "บันทึก" }}
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
        <BaseInputTextArea
          label="ความคิดเห็น"
          v-model="comment"
          placeholder="แสดงความคิดเห็น..."
          @onEnter="postComment"
        />

        <BaseButton @click="postComment"> ส่งความคิดเห็น </BaseButton>

        <ul class="mt-4 space-y-2">
          <li
            v-for="(c, i) in comments"
            :key="c.id || i"
            class="w-full rounded border px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <div class="font-semibold">{{ c.user || "ไม่ระบุชื่อ" }}</div>
            <div>{{ c.content }}</div>
            <div class="text-xs text-gray-400">
              {{ c.createdAt?.toDate?.().toLocaleString?.() || "..." }}
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="text-center text-red-500">ไม่พบบทความนี้</div>
    <ArticleRelate :article="article" />
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
  serverTimestamp,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { useHead, useAsyncData, onMounted } from "#imports";
import { createFirebase } from "~/composables/firebase";
import { useRequestURL, navigateTo } from "nuxt/app";
import type { ArticleType } from "~/types";
const { firestore } = createFirebase();
const ui = fullScreenLoading();
const route = useRoute();
const router = useRouter();
const { href } = useRequestURL();
const slug = route.params.slug as string;

const liked = ref(false);
const bookmarked = ref(false);
const comment = ref("");
const comments = ref<
  { id?: string; content: string; createdAt?: any; user?: string }[]
>([]);

const { data: articleData } = await useAsyncData<ArticleType | null>(
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
    const pojo = JSON.parse(JSON.stringify(rawData)) as Omit<ArticleType, "id">;
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
    getComment();
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

async function postComment() {
  const text = comment.value.trim();
  if (!text || !articleId.value) return;

  const commentData = {
    content: text,
    createdAt: serverTimestamp(),
    user: localStorage.getItem("user") || "Guest_" + new Date().getTime(),
  };

  try {
    await addDoc(
      collection(firestore, "articles", articleId.value, "comments"),
      commentData
    );

    comments.value.unshift(commentData);
    localStorage.setItem(`user`, "Guest_" + new Date().getTime());
    comment.value = "";
  } catch (err) {
    console.error("เพิ่มคอมเมนต์ไม่สำเร็จ:", err);
  }
}
async function getComment() {
  try {
    const commentSnap = await getDocs(
      query(
        collection(firestore, "articles", articleId.value, "comments"),
        orderBy("createdAt", "desc")
      )
    );
    comments.value = commentSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content ?? "",
        createdAt: data.createdAt,
        user: data.user ?? "ไม่ระบุชื่อ",
      };
    });
  } catch (err) {
    console.error("เพิ่มคอมเมนต์ไม่สำเร็จ:", err);
  }
}
</script>
