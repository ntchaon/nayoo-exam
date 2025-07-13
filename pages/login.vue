<template>
  <div class="max-w-md mx-auto">
    <BaseCard>
      <h1 class="text-2xl font-bold mb-4 text-center">เข้าสู่ระบบ</h1>

      <form @submit.prevent="handleEmailLogin" class="space-y-4">
        <BaseInput v-model="email" type="email" required placeholder="อีเมล" />
        <BaseInput
          v-model="password"
          type="password"
          required
          placeholder="รหัสผ่าน"
        />
        <div v-if="errors.error" class="text-red-400">{{ errors.message }}</div>
        <BaseButton type="submit" class="w-full"> เข้าสู่ระบบ </BaseButton>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "blank",
});
import { ref } from "vue";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { createFirebase } from "~/composables/firebase";
import { useAuthStore } from "~/stores/auth.store";
const authStore = useAuthStore();
const router = useRouter();
const { auth } = createFirebase();

const email = ref("");
const password = ref("");
const errors = ref({ error: false, message: "" });
async function handleEmailLogin() {
  try {
    const result = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    authStore.setUser(result.user);
    router.replace("/admin/articles");
  } catch (err: any) {
    errors.value = { error: true, message: err.message };
    console.log(err.message);
  }
}
watch(
  () => email.value,
  (val) => {
    if (val) {
      errors.value = { error: false, message: "" };
    }
  },
  { immediate: true }
);
watch(
  () => password.value,
  (val) => {
    if (val) {
      errors.value = { error: false, message: "" };
    }
  },
  { immediate: true }
);
</script>
