<template>
  <div class="space-y-1 w-full">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 dark:text-gray-200"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <input
      :type="type || 'text'"
      :accept="accept"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      :class="{
        'border-red-500 focus:ring-red-500': error,
        'cursor-not-allowed opacity-60': disabled,
      }"
      :value="modelValue"
      @input="onInput"
      @change="onChange"
    />
    <div v-if="!loading && previewImage" class="mt-2">
      <img :src="previewImage" class="max-w-xs rounded shadow" />
    </div>
    <div v-else-if="loading">
      <BaseLoadingSpinner />
    </div>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { createFirebase } from "~/composables/firebase";
const { firestore, storage } = createFirebase();
const props = defineProps<{
  modelValue: string | number | File | null;
  label?: string;
  placeholder?: string;
  type?: string;
  accept?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  previewImage?: string;
}>();
const loading = ref(false);
const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "update:previewImage", value: any): void;
  (e: "change", ev: Event): void;
}>();

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  if (props.type != "file") emit("update:modelValue", target.value);
}

async function onChange(e: Event) {
  emit("change", e);

  if (props.type === "file") {
    const target = e.target as HTMLInputElement;
    let file = target.files?.[0];
    if (!file) return;
    loading.value = true;
    const fileRef = storageRef(storage, `articles/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    let coverUrl = await getDownloadURL(fileRef);

    emit("update:previewImage", coverUrl);
    loading.value = false;

    emit("update:modelValue", target.value);
  }
}
</script>
