<template>
  <transition name="fade">
    <div
      v-if="ui.isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="text-center">
        <BaseLoadingSpinner />
        <p class="text-white">กำลังโหลด...</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { fullScreenLoading } from "@/stores/load";
const ui = fullScreenLoading();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
