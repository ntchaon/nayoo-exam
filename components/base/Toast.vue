<template>
  <div
    v-if="visible"
    class="w-full md:size-max fixed bottom-5 right-5 z-50 bg-red-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300"
  >
    <div v-html="message" class="whitespace-pre-line"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);
const message = ref("");

function show(msg = "เกิดข้อผิดพลาด", timeout = 3000) {
  message.value = msg;
  visible.value = true;
  console.log("visible", visible.value);
  setTimeout(() => {
    visible.value = false;
  }, timeout);
}

defineExpose({ show });
</script>
