<template>
  <div
    class="min-h-screen flex flex-col bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white"
  >
    <header class="bg-white dark:bg-gray-800 shadow z-10">
      <div
        class="container mx-auto px-4 py-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-bold">Nayoo Exam</h1>
        <nav class="space-x-4">
          <NuxtLink to="/" class="hover:underline">หน้าหลัก</NuxtLink>
          <NuxtLink to="/calculator" class="hover:underline"
            >คำนวนดอกเบี้ย</NuxtLink
          >
          <NuxtLink to="/comparison" class="hover:underline"
            >เปรียบเทียบสินเชื่อ</NuxtLink
          >
          <NuxtLink to="/article" class="hover:underline">บล็อก</NuxtLink>
        </nav>
      </div>
    </header>

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
useHead({
  titleTemplate: (title) => "Nayoo - exam",
  meta: [
    { name: "description", content: "ระบบจัดการลูกค้าสำหรับธุรกิจยุคใหม่" },
  ],
});
</script>
