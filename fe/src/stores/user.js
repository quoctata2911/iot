import { defineStore } from "pinia";

// import {
//   removeAccessToken,
//   setAccessToken,
// } from "@/composables/useLocalStorage";
// import { toast } from "vue3-toastify";

export const useUserStore = defineStore("user", {
  state: () => ({
    email: "",
    fullName: "",
  }),

  actions: {
    async login(data) {
      console.log(data, "check")
      const response = await signInApi(data);
      return this.authHandle(response);
      
    },

    async register(data) {
      // const response = await signUpApi(data);
      // return this.authHandle(response);
    },

    async getProfile() {
      // const response = await getProfileApi();
      // return response.data;
    },

    authHandle(response) {
      if (instanceOfDataError(response)) {
        toast.error(response.error || "error");
        return response.error;
      }
      setAccessToken(response.data.accessToken);
      return response.data;
    },
  },
});
