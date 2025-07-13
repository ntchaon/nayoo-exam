<template>
  <header class="bg-white dark:bg-gray-800 shadow z-10">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Nayoo Exam</h1>
      <nav class="space-x-4">
        <NuxtLink to="/" class="hover:underline">หน้าหลัก</NuxtLink>
        <NuxtLink to="/loan/calculator" class="hover:underline"
          >คำนวนดอกเบี้ย</NuxtLink
        >
        <NuxtLink to="/loan/comparison" class="hover:underline"
          >เปรียบเทียบสินเชื่อ</NuxtLink
        >
        <NuxtLink to="/article" class="hover:underline">บล็อก</NuxtLink>
        <NuxtLink to="/admin/articles" class="hover:underline" v-if="isAdmin"
          >จัดการบล็อก (Admin)</NuxtLink
        >
        <template v-if="authStore.user">
          <span class="text-sm text-gray-600 dark:text-gray-300">{{
            authStore.user.email
          }}</span>
          <BaseButton @click="logout" variant="link">ออกจากระบบ</BaseButton>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="hover:underline text-blue-600"
            >เข้าสู่ระบบ</NuxtLink
          >
        </template>
      </nav>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth.store";
import { signOut } from "firebase/auth";
import { createFirebase } from "~/composables/firebase";

const authStore = useAuthStore();
const { auth } = createFirebase();
const router = useRouter();
function logout() {
  signOut(auth);
  authStore.logout();
  router.replace("/");
}
const adminEmails = ["admin@nayoo.test"];

const isAdmin = computed(() => {
  const email = authStore.user?.email;
  return email && adminEmails.includes(email);
});
</script>
