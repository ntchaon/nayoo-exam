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

    <div v-if="loading">กำลังโหลด...</div>
    <div v-else-if="articles.length === 0">ยังไม่มีบทความ</div>

    <table v-else class="w-full table-auto border border-gray-300">
      <thead>
        <tr>
          <th class="p-3 border">ชื่อบทความ</th>

          <th class="p-3 border">วันที่</th>
          <th class="p-3 border text-center">จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in articles" :key="a.id">
          <td class="p-3 border">{{ a.title }}</td>

          <td class="p-3 border">{{ formatDate(a.createdAt) }}</td>
          <td class="p-3 border text-center space-x-2">
            <button
              class="text-blue-600 hover:underline"
              @click="goToEdit(a.id)"
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

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { createFirebase } from "~/composables/firebase";
const { firestore } = createFirebase();

const articles = ref([]);
const loading = ref(true);
const router = useRouter();

onMounted(async () => {
  const snapshot = await getDocs(collection(firestore, "articles"));
  articles.value = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  loading.value = false;
});

function goToEdit(id) {
  router.push(`/admin/articles/${id}`);
}

function goToCreate() {
  router.push("/admin/articles/create");
}

async function deleteArticle(id) {
  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?")) return;
  await deleteDoc(doc(firestore, "articles", id));
  articles.value = articles.value.filter((a) => a.id !== id);
}

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "-";
  return timestamp.toDate().toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>
