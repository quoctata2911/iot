<script setup>
import { ref } from "vue";
// import Navbar from "@/layout/NavbarLogin.vue";
// import Footer from "@/layout/Footer.vue";
import { useUserStore } from "@/stores/user";
import { toast } from "vue3-toastify";
import { setAccessToken, getAccessToken } from "@/composables/useLocalStorage";

const authStore = useUserStore();
const isLogin = ref(true);
const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const token = getAccessToken();
if (token) {
  window.location.href = "./dashboard";
}

const handleLogin = async () => {
  try {
    let response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_name: email.value, password: password.value }),
    });
    response = await response.json()
    console.log(response, "response");
    if (response && response.uid) {
      setAccessToken(response.uid);
      window.location.href = "./dashboard";
    } else {
      toast("Passwords are not the same!", {
        autoClose: 1000,
        position: toast.POSITION.TOP_RIGHT,
        type: "error",
      });
    }
  } catch (e) {
    console.log(e, "e");
  }

  return;
  try {
    let signInResponse = null;
    if (isLogin.value) {
      signInResponse = await authStore.login({
        email: email.value,
        password: password.value,
      });
    } else {
      if (password.value !== confirmPassword.value) {
        return toast("Passwords are not the same!", {
          autoClose: 1000,
          position: toast.POSITION.TOP_RIGHT,
          type: "error",
        });
      }
      signInResponse = await authStore.register({
        fullName: fullName.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      });
    }
    if (signInResponse && signInResponse.accessToken) {
    }
    return true;
  } catch (e) {
    console.error(e, "login error");
    return false;
  }
};
</script>
<template>
  <div>
    <!-- <Navbar></Navbar> -->
    <main>
      <section class="absolute w-full h-full">
        <div
          class="absolute top-0 w-full h-full bg-gray-900"
          style="background-size: 100%; background-repeat: no-repeat"
          :style="`background-image: url(src/assets/img/register_bg_2.png);`"
        ></div>
        <div class="container mx-auto px-4 h-full">
          <div class="flex content-center items-center justify-center h-full">
            <div class="w-full lg:w-4/12 px-4">
              <div
                class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0"
              >
                <div class="rounded-t mb-0 px-6 py-6">
                  <div class="text-center mb-3">
                    <h6 class="text-gray-600 text-sm font-bold">
                      Sign in with
                    </h6>
                  </div>
                  <div class="btn-wrapper text-center">
                    <!-- <button
											class="bg-white active:bg-gray-100 text-gray-800 px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
											type="button"
											style="transition: all 0.15s ease 0s"
											disabled
										>
											<img alt="..." class="w-5 mr-1" src="src/assets/svg/github.svg" />
											<div>Github</div>
										</button>
										<button
											class="bg-white active:bg-gray-100 text-gray-800 px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
											type="button"
											disabled
											style="transition: all 0.15s ease 0s"
										>
											<img alt="..." class="w-5 mr-1" src="src/assets/svg/google.svg" />Google
										</button> -->
                  </div>
                  <hr class="mt-6 border-b-1 border-gray-400" />
                </div>
                <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div class="text-gray-500 text-center mb-3 font-bold">
                    <small>Or sign in with credentials</small>
                  </div>
                  <form>
                    <div v-if="!isLogin" class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="grid-password"
                        >full name</label
                      >
                      <input
                        v-model="fullName"
                        type="text"
                        autocomplete="name"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Full name"
                        style="transition: all 0.15s ease 0s"
                      />
                    </div>
                    <div class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="grid-password"
                        >Email</label
                      >
                      <input
                        v-model="email"
                        type="email"
                        autocomplete="email"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Email"
                        style="transition: all 0.15s ease 0s"
                      />
                    </div>
                    <div class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="grid-password"
                        >Password</label
                      >
                      <input
                        v-model="password"
                        autocomplete="current-password"
                        type="password"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Password"
                        style="transition: all 0.15s ease 0s"
                      />
                    </div>
                    <div v-if="!isLogin" class="relative w-full mb-3">
                      <label
                        class="block uppercase text-gray-700 text-xs font-bold mb-2"
                        for="grid-password"
                        >Confirm Password</label
                      >
                      <input
                        v-model="confirmPassword"
                        autocomplete="password"
                        type="password"
                        class="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        placeholder="Password"
                        style="transition: all 0.15s ease 0s"
                      />
                    </div>
                    <!-- <div>
											<label class="inline-flex items-center cursor-pointer"
												><input
													id="customCheckLogin"
													type="checkbox"
													class="form-checkbox border-0 rounded text-gray-800 ml-1 w-5 h-5"
													style="transition: all 0.15s ease 0s"
												/><span class="ml-2 text-sm font-semibold text-gray-700">Remember me</span></label
											>
										</div> -->
                    <div class="text-center mt-6">
                      <button
                        class="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        style="transition: all 0.15s ease 0s"
                        @click="handleLogin"
                      >
                        {{ !isLogin ? "Register" : "Login" }}
                      </button>
                    </div>
                    <div
                      class="cursor-pointer pt-2 w-fit max-w-[130px] select-none"
                      @click="isLogin = !isLogin"
                    >
                      {{ isLogin ? "Register" : "Login" }}
                    </div>
                  </form>
                </div>
              </div>
              <div class="flex flex-wrap mt-6">
                <div class="w-1/2">
                  <a href="#pablo" class="text-gray-300"
                    ><small>Forgot password?</small></a
                  >
                </div>
                <div class="w-1/2 text-right">
                  <a href="#pablo" class="text-gray-300"
                    ><small>Create new account</small></a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <Footer></Footer> -->
      </section>
    </main>
  </div>
</template>
