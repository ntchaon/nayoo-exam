<template>
  <div class="space-y-1 w-full">
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 dark:text-gray-200"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <textarea
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
      @keypress.enter.prevent="emit('onEnter')"
      rows="4"
    />

    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}>();
const loading = ref(false);
const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "update:previewImage", value: any): void;
  (e: "change", ev: Event): void;
  (e: "onEnter"): void;
}>();

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>
