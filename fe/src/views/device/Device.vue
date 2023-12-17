<script setup>
import { reactive, onMounted } from "vue";
import { FwbCard } from "flowbite-vue";

const devices = reactive();

const run = async () => {
  let response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_name: email.value, password: password.value }),
  });
};

onMounted(() => {
  run();
});
</script>
<template>
  <div class="flex gap-4 flex-wrap justify-between mr-3 h-full overflow-auto scroll-w-2">
    <div v-for="item in 20">
      <fwb-card
        img-alt="Desk"
        img-src="https://flowbite.com/docs/images/blog/image-1.jpg"
        variant="image"
        class="cursor-pointer"
      >
        <div class="p-5">
          <h5
            class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Noteworthy technology acquisitions 2021
          </h5>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
        </div>
      </fwb-card>
    </div>
  </div>
</template>
