<template>
  <div
    class="min-h-screen flex flex-col bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white"
  >
    <Header />

    <main class="flex-1 container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer
      class="bg-gray-100 dark:bg-gray-800 text-center py-4 text-sm text-gray-500"
    >
      &copy; {{ new Date().getFullYear() }} LoanCalc Inc. All rights reserved.
    </footer>
  </div>
</template>
<script setup>
import Header from "~/components/base/Header.vue";
useHead({
  titleTemplate: (title) => "Nayoo - exam",
  meta: [
    { name: "description", content: "ระบบจัดการลูกค้าสำหรับธุรกิจยุคใหม่" },
  ],
});
</script>
