<!-- components/BaseStatusSelect.vue -->
<template>
  <label
    v-if="label"
    class="block text-sm font-medium text-gray-700 dark:text-gray-200"
  >
    {{ label }}
    <span v-if="required" class="text-red-500">*</span>
  </label>
  <select
    v-model="model"
    class="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
  >
    <option value="draft">ฉบับร่าง</option>
    <option value="published">เผยแพร่</option>
  </select>
</template>

<script setup lang="ts">
const model = defineModel<string>({ required: true });
const props = defineProps<{
  label?: string;
  required?: boolean;
}>();
</script>
