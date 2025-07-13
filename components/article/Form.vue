<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      v-model="form.title"
      label="ชื่อบทความ"
      required
      placeholder="ชื่อบทความ"
    />

    <BaseInput
      type="file"
      accept="image/*"
      label="ภาพหน้าปก"
      v-model="form.coverFile"
      @update:previewImage="form.coverUrl = $event"
      :previewImage="form.coverUrl"
    />

    <BaseInputTextArea
      v-model="form.description"
      label="คำอธิบาย"
      required
      type="textarea"
      placeholder="คำอธิบายสั้นๆ เกี่ยวกับบทความนี้"
    />
    <BaseInput
      v-model="form.slug"
      label="ลิงก์บทความ"
      required
      placeholder="ลิงก์บทความ"
    />
    <BaseTinyMCE v-model="form.content" label="คอนเทนต์" required />
    <BaseInputTags v-model="form.tags" label="Tags" />
    <BaseSelect v-model="form.category" label="หมวดหมู่" required>
      <option value="" disabled>เลือกหมวดหมู่</option>
      <option :value="opt.value" v-for="opt of categoryList">
        {{ opt.label }}
      </option>
    </BaseSelect>
    <BaseSelect v-model="form.status" label="สถานะเนื้อหา" required>
      <option value="draft">ร่างบทความ</option>
      <option value="published">เผยแพร่แล้ว</option>
      <option value="archived">เก็บถาวร</option>
    </BaseSelect>

    <div>
      <label class="inline-flex items-center space-x-2 mt-2">
        <BaseSwitch v-model="form.isActive" />
        <span>เปิดใช้งาน</span>
      </label>
    </div>

    <div class="pt-4 text-right">
      <BaseButton :loading="uploading" type="submit">
        {{ isEditMode ? "อัปเดตบทความ" : "บันทึกบทความ" }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  Timestamp,
  getDocs,
} from "firebase/firestore";

import { createFirebase } from "~/composables/firebase";
import type { Category } from "~/types";
const props = defineProps<{
  initialData?: any;
  articleId?: string;
  onSaved?: () => void;
}>();

const isEditMode = computed(() => !!props.articleId);
const { firestore, storage } = createFirebase();
const router = useRouter();
const categoryList = ref<Category[]>([]);
const form = reactive({
  title: "",
  content: "",
  coverFile: null as File | null,
  coverUrl: "",
  category: "",
  tags: [] as string[],
  isActive: false,
  status: "draft",
  description: "",
  slug: "",
});

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      Object.assign(form, val);
    }
  },
  { immediate: true }
);
onMounted(() => {
  getCategories();
});
const uploading = ref(false);

async function getCategories() {
  const colRef = collection(firestore, "categories");
  const snapshot = await getDocs(colRef);

  const categories: { value: string; label: string }[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    categories.push({
      value: doc.id, // ใช้ doc id เป็น value
      label: data.label ?? "", // fallback เผื่อ label ไม่มี
    });
  });
  categoryList.value = categories;
}
async function handleSubmit() {
  uploading.value = true;

  const payload = {
    ...form,
    updatedAt: Timestamp.now(),
  };

  if (isEditMode.value && props.articleId) {
    await updateDoc(doc(firestore, "articles", props.articleId), payload);
  } else {
    await addDoc(collection(firestore, "articles"), {
      ...payload,
      createdAt: Timestamp.now(),
    });
  }

  uploading.value = false;

  if (props.onSaved) props.onSaved();
  else router.push("/admin/articles");
}
</script>
