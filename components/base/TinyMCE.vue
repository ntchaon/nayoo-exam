<template>
  <label
    v-if="label"
    class="block text-sm font-medium text-gray-700 dark:text-gray-200"
  >
    {{ label }}
    <span v-if="required" class="text-red-500">*</span>
  </label>
  <client-only>
    <Editor
      v-model="content"
      :init="init"
      :disabled="disabled"
      :id="editorId"
      api-key="uev9y17oz7fuowyuw75r34y0zs177puofqwn7qe3y21qo534"
    />
  </client-only>
</template>

<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue";
import { useId } from "#imports";

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const content = computed({
  get: () => props.modelValue,
  set: (val: string) => emit("update:modelValue", val),
});

const editorId = useId();

const init = {
  menubar: true,
  height: 600,

  toolbar:
    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
  tinycomments_mode: "embedded",
  content_style: `
    body {
      font-family: Inter, sans-serif;
      padding: 0.5rem;
    }
    .dark & {
      background: #1e293b;
      color: #fff;
    }
  `,
  skin: "oxide",
  content_css: "default",
};
</script>
