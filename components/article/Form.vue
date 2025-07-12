<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput v-model="form.title" label="ชื่อบทความ" required />

    <div>
      <BaseInput
        type="file"
        accept="image/*"
        label="ภาพหน้าปก"
        v-model="form.coverFile"
        @update:previewImage="form.coverUrl = $event"
        :previewImage="form.coverUrl"
      />
    </div>

    <BaseTinyMCE v-model="form.content" label="คอนเทนต์" required />

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
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { createFirebase } from "~/composables/firebase";

const props = defineProps<{
  initialData?: any;
  articleId?: string;
  onSaved?: () => void;
}>();

const isEditMode = computed(() => !!props.articleId);
const { firestore, storage } = createFirebase();
const router = useRouter();

const form = reactive({
  title: "",
  content: "",
  coverFile: null as File | null,
  coverUrl: "",

  isActive: false,
  status: "draft",
});

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      console.log(val);
      Object.assign(form, {
        title: val.title || "",
        content: val.content || "",
        coverUrl: val.coverUrl || "",
        isActive: val.isActive || false,
        status: val.status || "draft",
      });
    }
  },
  { immediate: true }
);

const uploading = ref(false);

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
