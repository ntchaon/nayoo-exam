<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">บทความทั้งหมด</h1>
      <button
        @click="goToCreate"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + เพิ่มบทความ
      </button>
    </div>

    <div class="flex flex-col md:flex-row md:items-center gap-4 mb-6">
      <BaseInput
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหาชื่อบทความ..."
      />

      <ArticleCategoryList v-model="selectedCategory">
        <option value="all">เลือกทั้งหมด</option>
      </ArticleCategoryList>
      <div @click="clearFilter" class="cursor-pointer">ล้าง</div>
    </div>

    <div v-if="ui.isLoading"><BaseLoadingSpinner /></div>
    <div v-else-if="filteredArticles.length === 0">ไม่พบข้อมูลบทความ</div>

    <table v-else class="w-full table-auto border border-gray-300">
      <thead>
        <tr>
          <th class="p-3 border">ชื่อบทความ</th>
          <th class="p-3 border">หมวดหมู่</th>
          <th class="p-3 border">วันที่</th>
          <th class="p-3 border">เผยแพร่</th>
          <th class="p-3 border">สถานะ</th>
          <th class="p-3 border">จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in filteredArticles" :key="a.id">
          <td class="p-3 border">
            {{ a.title }}
            <div v-if="a.tags?.length" class="text-sm text-gray-500">
              แท็ก: {{ a.tags.join(", ") }}
            </div>
          </td>
          <td class="p-3 border text-center">{{ a.category }}</td>
          <td class="p-3 border text-center">{{ formatDate(a.createdAt) }}</td>
          <td class="p-3 border text-center">
            {{
              a.status == "published"
                ? "เผยแพร่"
                : a.status == "archived"
                ? "เก็บถาวร"
                : "ร่าง"
            }}
          </td>
          <td class="p-3 border text-center">
            {{ a.isActive ? "ใช้งาน" : "ปิดการใช้งาน" }}
          </td>
          <td class="p-3 border text-center space-x-2">
            <button
              class="text-blue-600 hover:underline"
              v-if="a.slug"
              @click="goToEdit(a.slug)"
            >
              แก้ไข
            </button>
            <button
              class="text-red-600 hover:underline"
              @click="deleteArticle(a.id)"
            >
              ลบ
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { createFirebase } from "~/composables/firebase";
import { BaseLoadingSpinner } from "#components";
import type { ArticleType } from "~/types";
import { fullScreenLoading } from "@/stores/load";

const { firestore } = createFirebase();
const ui = fullScreenLoading();
const articles = ref<ArticleType[]>([]);
const searchQuery = ref("");
const selectedCategory = ref("all");

const router = useRouter();
definePageMeta({
  middleware: ["admin"],
});
onMounted(async () => {
  ui.startLoading();
  const snapshot = await getDocs(collection(firestore, "articles"));
  articles.value = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ArticleType[];
  ui.stopLoading();
});

function goToEdit(slug: string) {
  router.push(`/admin/articles/${slug}`);
}

function goToCreate() {
  router.push("/admin/articles/create");
}

async function deleteArticle(id: string) {
  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?")) return;

  const articleRef = doc(firestore, "articles", id);
  await updateDoc(articleRef, {
    status: "archived",
    isActive: false,
  });
}

function formatDate(timestamp: any) {
  if (!timestamp?.toDate) return "-";
  return timestamp.toDate().toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const filteredArticles = computed(() => {
  return articles.value.filter((a) => {
    console.log(a);
    const matchTitle = a.title
      ?.toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    console.log(matchTitle);
    if (selectedCategory.value === "all") {
      return matchTitle;
    }
    const matchCategory =
      !selectedCategory.value || a.category === selectedCategory.value;
    return matchTitle && matchCategory;
  });
});
function clearFilter() {
  searchQuery.value = "";
  selectedCategory.value = "all";
}
</script>
