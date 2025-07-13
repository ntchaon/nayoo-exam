<template>
  <div class="space-y-4">
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

    <ArticleCategoryList v-model="form.category" />

    <div>
      <label class="inline-flex items-center space-x-2 mt-2">
        <BaseSwitch v-model="form.isActive" />
      </label>
    </div>

    <div class="pt-4 flex items-center justify-between">
      <div class="w-2/4 space-x-2">
        <BaseButton
          :loading="ui.isLoading"
          @click="submitAsDraft"
          variant="warning"
        >
          ย้อนกลับ
        </BaseButton>
        <BaseButton
          :loading="ui.isLoading"
          @click="deleteArticle"
          variant="danger"
          v-if="isEditMode && form.status != 'archived'"
        >
          ลบบทความ
        </BaseButton>
      </div>
      <div class="w-2/4 space-x-2 text-right">
        <BaseButton
          :loading="ui.isLoading"
          @click="submitAsDraft"
          variant="info"
        >
          {{ isEditMode ? "บันทึกร่าง" : "บันทึกร่างบทความ" }}
        </BaseButton>
        <BaseButton :loading="ui.isLoading" @click="submitAsPublished">
          บันทึกบทความ (เผยแพร่)
        </BaseButton>
      </div>
    </div>
    <Toast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { fullScreenLoading } from "@/stores/load";
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
import Toast from "@/components/base/Toast.vue";

import type { Category } from "~/types";
const ui = fullScreenLoading();
const props = defineProps<{
  initialData?: any;
  articleId?: string;
  onSaved?: () => void;
}>();
const toastRef = ref();
const isEditMode = computed(() => !!props.articleId);
const { firestore, storage } = createFirebase();
const router = useRouter();

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

async function handleSubmit() {
  ui.startLoading();

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

  ui.stopLoading();

  if (props.onSaved) props.onSaved();
  else router.push("/admin/articles");
}
async function validateForm() {
  var errors = false;
  var message = [];
  if (!form.title.trim()) {
    message.push("กรุณากรอกชื่อบทความ");
    errors = true;
  }
  if (!form.description.trim()) {
    message.push("กรุณากรอกคำอธิบาย");
    errors = true;
  }
  if (!form.content.trim()) {
    message.push("กรุณากรอกเนื้อหา");
    errors = true;
  }
  if (!form.slug.trim()) {
    message.push("กรุณากรอกลิงก์บทความ");
    errors = true;
  }
  if (!form.category.trim()) {
    message.push("กรุณาเลือกหมวดหมู่");
    errors = true;
  }
  toastRef.value.show(message.join("\n"));
  return !errors;
}

async function submitAsDraft() {
  const error = await validateForm();
  if (!error) return;

  form.status = "draft";
  handleSubmit();
}

async function submitAsPublished() {
  const error = await validateForm();
  if (!error) return;

  form.status = "published";
  handleSubmit();
}
async function deleteArticle(id: string) {
  if (!props.articleId) return;
  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?")) return;

  ui.startLoading();
  try {
    const articleRef = doc(firestore, "articles", props.articleId);
    await updateDoc(articleRef, {
      status: "archived",
      isActive: false,
    });
    router.push("/admin/articles");
  } catch (err) {
    toastRef.value.show("เกิดข้อผิดพลาดในการลบบทความ");
  } finally {
    ui.stopLoading();
  }
}
</script>
