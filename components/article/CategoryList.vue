<template>
  <BaseSelect
    :model-value="modelValue"
    @update:modelValue="onSelect"
    :label="showLabel ? 'หมวดหมู่' : ''"
    required
  >
    <option value="" disabled>เลือกหมวดหมู่</option>
    <slot />
    <option :value="opt.value" v-for="opt of categoryList" :key="opt.value">
      {{ opt.label }}
    </option>
  </BaseSelect>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import type { Category } from "~/types";
import { createFirebase } from "~/composables/firebase";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps<{
  modelValue: string | number;
  showLabel: { type: Boolean; default: true; required: false };
}>();

const { firestore } = createFirebase();
const categoryList = ref<Category[]>([]);

onMounted(async () => {
  const cached = localStorage.getItem("category_list_cache");

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const now = Date.now();

      if (
        now - parsed.timestamp < 1000 * 60 * 60 &&
        Array.isArray(parsed.data)
      ) {
        categoryList.value = parsed.data;
        return;
      }
    } catch (e) {
      console.warn("Invalid category cache", e);
    }
  }

  const colRef = collection(firestore, "categories");
  const snapshot = await getDocs(colRef);

  const categories: { value: string; label: string }[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    categories.push({
      value: doc.id,
      label: data.label ?? "",
    });
  });

  categoryList.value = categories;

  localStorage.setItem(
    "category_list_cache",
    JSON.stringify({
      timestamp: Date.now(),
      data: categories,
    })
  );
});

function onSelect(val: string | number) {
  emit("update:modelValue", val);
}
</script>
