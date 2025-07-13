import { defineStore } from "pinia";
import type { User } from "firebase/auth";

type SimpleUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export const useAuthStore = defineStore("auth", {
  state: (): { user: SimpleUser | null } => ({
    user: null,
  }),

  actions: {
    setUser(user: User | SimpleUser | null) {
      if (user) {
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };
        localStorage.setItem("authUser", JSON.stringify(this.user));
      } else {
        this.user = null;
        localStorage.removeItem("authUser");
      }
    },

    loadFromStorage() {
      const raw = localStorage.getItem("authUser");
      if (raw) {
        this.user = JSON.parse(raw);
      }
    },

    logout() {
      this.setUser(null);
    },
  },
});
