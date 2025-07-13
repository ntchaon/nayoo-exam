import { useAuthStore } from "~/stores/auth.store";

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  const adminEmails = ["admin@nayoo.test"];

  let email = authStore.user?.email;
  console.log(email);
  if (!email && process.client) {
    const userData = localStorage.getItem("authUser");
    console.log(userData);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        email = user?.email;

        authStore.user = user;
      } catch (err: any) {
        console.log(err.message);
      }
    }
    if (!email || !adminEmails.includes(email)) {
      return navigateTo("/login");
    }
  }
});
