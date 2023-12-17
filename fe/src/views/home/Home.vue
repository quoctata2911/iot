<script setup>
import { ref, reactive, onMounted } from "vue";
import { FwbButton, FwbModal, FwbInput, FwbCard } from "flowbite-vue";
import { setAccessToken, getAccessToken } from "@/composables/useLocalStorage";
import { useRouter } from "vue-router";

const router = useRouter();

const homes = reactive({});
const name = ref("");
const address = ref("");
const isShowModal = ref(false);
const uid = getAccessToken();

async function closeModal(params) {
  if (params) {
    try {
      const url = `http://localhost:5000/api/home/${uid}/create-home`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ home_name: name.value, address: address.value }),
      });
      response = await response.json();
    } catch (e) {}
  }
  run();
  name.value = ""
  address.value = ""
  isShowModal.value = false;
}
function showModal() {
  isShowModal.value = true;
}

const run = async () => {
  const url = `http://localhost:5000/api/home/${uid}`;
  console.log(url, "url");
  let response = await fetch(url);
  response = await response.json();
  response.reverse()
  Object.assign(homes, response);
  console.log(homes, "homes");
};

onMounted(() => {
  run();
});
</script>
<template>
  <div class="h-[calc(100vh-125px)]">
    <div class="mb-2">
      <fwb-button @click="showModal" gradient="purple-blue"
        >Add home</fwb-button
      >

      <fwb-modal v-if="isShowModal" @close="closeModal">
        <template #header>
          <div class="flex items-center text-lg">Terms of Service</div>
        </template>
        <template #body>
          <fwb-input
            v-model="name"
            label="Name"
            placeholder="enter your name"
            size="sm"
          />
          <div class="h-5"></div>
          <fwb-input
            v-model="address"
            label="Address"
            placeholder="enter your address"
            size="sm"
          />
        </template>
        <template #footer>
          <div class="flex justify-between">
            <fwb-button @click="closeModal" color="alternative">
              Decline
            </fwb-button>
            <fwb-button @click="closeModal" color="green">
              I accept
            </fwb-button>
          </div>
        </template>
      </fwb-modal>
    </div>
    <div
      class="flex gap-4 flex-wrap justify-between mr-3 h-full overflow-auto scroll-w-2"
    >
      <div v-for="item in homes">
        <fwb-card
          img-alt="Desk"
          img-src="https://flowbite.com/docs/images/blog/image-1.jpg"
          variant="image"
          class="cursor-pointer w-[350px]"
          @click="router.push(`/device/${item._id}`)"
        >
          <div class="p-5">
            <h5
              class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {{ item.home_name }}
            </h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              {{ item.address }}
            </p>
          </div>
        </fwb-card>
      </div>
    </div>
  </div>
</template>
