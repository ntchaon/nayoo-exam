import { defineStore } from "pinia";

export const fullScreenLoading = defineStore("ui", () => {
  const isLoading = ref(false);

  function startLoading() {
    isLoading.value = true;
  }

  function stopLoading() {
    isLoading.value = false;
  }

  return { isLoading, startLoading, stopLoading };
});
