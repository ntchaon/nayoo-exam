<template>
  <BaseCard class="max-w-4xl mx-auto" v-if="!ui.isLoading">
    <h1 class="text-2xl font-bold mb-4">แก้ไขบทความ</h1>
    <ArticleForm :initialData="form" :articleId="formId" />
  </BaseCard>
</template>

<script setup lang="ts">
import { fullScreenLoading } from "@/stores/load";
const ui = fullScreenLoading();
import { doc, getDoc } from "firebase/firestore";

import { createFirebase } from "~/composables/firebase";

const route = useRoute();
const router = useRouter();
const { firestore } = createFirebase();

const form = reactive({
  title: "",
  content: "",
  coverUrl: "",
  coverFile: null as File | null,
});
const loading = ref(true);
const formId = ref(route.params.id as string);

onBeforeMount(async () => {
  ui.startLoading();
  const docRef = doc(firestore, "articles", route.params.id as string);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    Object.assign(form, snap.data());
    loading.value = false;
    ui.stopLoading();
  } else {
    router.push("/admin/articles");
  }
});
</script>
