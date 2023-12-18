<script setup>
import { ref, reactive, onMounted } from "vue";
import { FwbButton, FwbModal, FwbInput, FwbCard } from "flowbite-vue";
import { setAccessToken, getAccessToken } from "@/composables/useLocalStorage";
import { useRoute } from "vue-router";

const homes = reactive({});
const value1 = ref("");
const value2 = ref("");
const value3 = ref("");
const value4 = ref("");
const isShowModal = ref(false);
const uid = getAccessToken();
const route = useRoute();
const homeId = route.params.id;

async function closeModal(params) {
  if (params) {
    try {
      const url = `http://localhost:5000/api/device/${uid}/${homeId}/register`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_name: value1.value,
          mac_address: value2.value,
          device_type: value3.value,
          device_code: value4.value,
        }),
      });

      response = await response.json();
    } catch (e) {}
  }
  run();
  isShowModal.value = false;
}
function showModal() {
  isShowModal.value = true;
}

const run = async () => {
  const url = `http://localhost:5000/api/device/${uid}/${homeId}`;
  let response = await fetch(url);
  response = await response.json();
  response.reverse();
  Object.assign(homes, response);
  console.log(homes, "homes");
};

onMounted(() => {
  run();
});

const editHome = (id, event) => {
  event.stopPropagation();
  // isShowModal.value = 2;
  console.log(id);
};

const deleteHome = async (id, event) => {
  event.stopPropagation();
  console.log(id);

  // const url = `http://localhost:5000/api/home/${uid}/delete/${id}`;
  // let response = await fetch(url, {
  //   method: "DELETE",
  // });
  // run();
};
</script>
<template>
  <div class="h-[calc(100vh-125px)]">
    <div class="mb-2">
      <fwb-button @click="showModal" gradient="purple-blue"
        >Add device</fwb-button>
     

      <fwb-modal v-if="isShowModal" @close="closeModal">
        <template #header>
          <div class="flex items-center text-lg">Thêm thiết bị</div>
        </template>
        <template #body>
          <fwb-input v-model="value1" label="Name" size="sm" />
          <div class="h-5"></div>
          <fwb-input v-model="value2" label="mac address " size="sm" />
          <div class="h-5"></div>
          <fwb-input v-model="value3" label="device type " size="sm" />
          <div class="h-5"></div>
          <fwb-input v-model="value4" label="device code" size="sm" />
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
        >
          <div class="p-5">
            <h5
              class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              name: {{ item.device_name }}
            </h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              mac address: {{ item.mac_address }}
            </p>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              {{
                "type: " +
                item.device_status.type +
                " - " +
                "code: " +
                item.device_status.code
              }}
            </p>
            <div class="flex gap-2 justify-end mt-4">
              <fwb-button @click="editHome(item._id, $event)" gradient="green"
                >Chỉnh sửa</fwb-button
              >
              <fwb-button @click="deleteHome(item._id, $event)" gradient="red"
                >Xóa</fwb-button
              >
            </div>
          </div>
        </fwb-card>
      </div>
    </div>
  </div>
</template>
