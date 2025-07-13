<template>
  <div
    class="min-h-screen flex flex-col bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white align-center justify-center"
  >
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>
<script setup>
useHead({
  titleTemplate: (title) => "Nayoo - exam",
  meta: [
    { name: "description", content: "ระบบจัดการลูกค้าสำหรับธุรกิจยุคใหม่" },
  ],
});
</script>
