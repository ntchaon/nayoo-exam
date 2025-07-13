<template>
  <label
    v-if="label"
    class="block text-sm font-medium text-gray-700 dark:text-gray-200"
  >
    {{ label }}
    <span v-if="required" class="text-red-500">*</span>
  </label>
  <div
    class="border rounded-lg px-2 py-1 flex flex-wrap gap-1 min-h-[40px] items-center focus-within:ring-2 focus-within:ring-blue-500"
    @click="focusInput"
  >
    <span
      v-for="(tag, index) in tags"
      :key="index"
      class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1 text-sm"
    >
      {{ tag }}
      <button
        type="button"
        class="hover:text-red-500"
        @click.stop="removeTag(index)"
      >
        ×
      </button>
    </span>

    <input
      ref="inputRef"
      v-model="input"
      @keydown.enter.prevent="addTag"
      @keydown.backspace="removeLastIfEmpty"
      class="flex-1 text-sm py-1 px-1 min-w-[100px] bg-white dark:bg-gray-800"
      placeholder="พิมพ์แล้ว Enter"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

const tags = ref([...props.modelValue]);
const input = ref("");
const inputRef = ref(null);

watch(tags, (val) => {
  emit("update:modelValue", val);
});

function addTag() {
  const newTag = input.value.trim();
  if (newTag && !tags.value.includes(newTag)) {
    tags.value.push(newTag);
  }
  input.value = "";
}

function removeTag(index) {
  tags.value.splice(index, 1);
}

function removeLastIfEmpty(e) {
  if (!input.value && tags.value.length) {
    tags.value.pop();
  }
}

function focusInput() {
  inputRef.value?.focus();
}
</script>
