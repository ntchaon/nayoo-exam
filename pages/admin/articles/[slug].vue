<template>
  <BaseCard class="max-w-4xl mx-auto" v-if="!ui.isLoading">
    <h1 class="text-2xl font-bold mb-4">แก้ไขบทความ</h1>
    <ArticleForm :initialData="form" :articleId="formId" />
  </BaseCard>
</template>

<script setup lang="ts">
import { fullScreenLoading } from "@/stores/load";
const ui = fullScreenLoading();
import { doc, getDocs, query, collection, where } from "firebase/firestore";

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
  const slug = route.params.slug as string;
  const docRef = query(
    collection(firestore, "articles"),
    where("slug", "==", slug)
  );

  // const q = doc(firestore, "articles", route.params.id as string);
  const snap = await getDocs(docRef);

  if (!snap.empty) {
    const docSnap = snap.docs[0];
    Object.assign(form, docSnap.data());

    ui.stopLoading();
  } else {
    router.push("/admin/articles");
  }
  loading.value = false;
});
</script>
