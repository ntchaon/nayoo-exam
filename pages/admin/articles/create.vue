<template>
  <BaseCard class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">สร้างบทความใหม่</h1>

    <ArticleForm />
  </BaseCard>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { createFirebase } from "~/composables/firebase";

const { firestore, storage } = createFirebase(); // ✅ ดึงจาก composable (เรียกใน setup)

const form = ref({
  title: "",
  content: "",
  coverFile: null as File | null,
  isActive: false,
  status: "draft",
});

const uploading = ref(false);
const router = useRouter();

async function handleSubmit() {
  uploading.value = true;

  let coverUrl = "";
  if (form.value.coverFile) {
    const fileRef = storageRef(
      storage,
      `covers/${Date.now()}_${form.value.coverFile.name}`
    );
    await uploadBytes(fileRef, form.value.coverFile);
    coverUrl = await getDownloadURL(fileRef);
  }

  await addDoc(collection(firestore, "articles"), {
    title: form.value.title,
    content: form.value.content,
    coverUrl,
    createdAt: Timestamp.now(),
  });

  uploading.value = false;
  router.push("/admin/articles");
}
</script>
