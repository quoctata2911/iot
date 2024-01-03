<script setup>
import { ref, reactive, onMounted } from "vue";
import { FwbButton, FwbModal, FwbInput, FwbCard, FwbSelect } from "flowbite-vue";
import { setAccessToken, getAccessToken } from "@/composables/useLocalStorage";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";

const homes = reactive({});
const value1 = ref("");
const value2 = ref("");
const value3 = ref("");
const value4 = ref("");
const isShowModal = ref(false);
const isShowModal2 = ref(false);
const typeOpenDetail = ref("")
const uid = getAccessToken();
const route = useRoute();
const homeId = route.params.id;
let idEdit = ""


const socket = io("http://localhost:5000");

const dht  = ref("")
const led = ref("")
const runSocket = () => {
  socket.on("send-dht",(data) => {
    dht.value = data
  })

  socket.on("send-led",(data) => {
    console.log(data, "led")
    led.value = data
  })
}

const countries = [
  { value: 'sensor', name: 'sensor' },
  { value: 'led', name: 'led' },
]

async function closeModal(params) {
  try {
    if (params === 1) {
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
    } else if (params === 2) {
      const url = `http://localhost:5000/api/device/${uid}/${homeId}/${idEdit}`;
      let response = await fetch(url, {
        method: "PUT",
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
    }
  } catch (e) {}
  run();
  isShowModal.value = false;
}
function showModal() {
  isShowModal.value = 1;
}

const run = async () => {
  const url = `http://localhost:5000/api/device/${uid}/${homeId}`;
  let response = await fetch(url);
  response = await response.json();
  response.reverse();
  Object.keys(homes).forEach((key) => delete homes[key]);
  Object.assign(homes, response);
  console.log(homes, "homes");
};

onMounted(() => {
  run();
  runSocket()
});

const editHome = (id, event) => {
  event.stopPropagation();
  // isShowModal.value = 2;
  idEdit = id
  console.log(id);
  isShowModal.value = 2;
};

const deleteHome = async (id, event) => {
  event.stopPropagation();
  console.log(id);

  const url = `http://localhost:5000/api/device/${uid}/${homeId}/${id}`;
  let response = await fetch(url, {
    method: "DELETE",
  });
  run();
};

const openModal2 = (tt) => {
  isShowModal2.value = true
  typeOpenDetail.value = tt
}

</script>
<template>
  <div class="h-[calc(100vh-125px)]">
    <div class="mb-2">
      <fwb-button @click="showModal" gradient="purple-blue"
        >Add device</fwb-button
      >

      <fwb-modal v-if="isShowModal" @close="closeModal">
        <template #header>
          <div class="flex items-center text-lg">
            {{ isShowModal === 1 ? "Thêm thiết bị" : "Sửa thiết bị" }}
          </div>
        </template>
        <template #body>
          <fwb-input v-model="value1" label="Name" size="sm" />
          <div class="h-5"></div>
          <fwb-input v-model="value2" label="mac address " size="sm" />
          <div class="h-5"></div>
          <!-- <fwb-input v-model="value3" label="device type " size="sm" /> -->

          <fwb-select
    v-model="value3"
    :options="countries"
    label="chọn type"
  />

          <!-- <div class="h-5"></div> -->
          <!-- <fwb-input v-model="value4" label="device code" size="sm" /> -->
        </template>
        <template #footer>
          <div class="flex justify-between">
            <fwb-button @click="closeModal" color="alternative">
              Decline
            </fwb-button>
            <fwb-button @click="closeModal(isShowModal)" color="green">
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
          @click="openModal2(item.device_status.type)"
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
                item.device_status.type 
       
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
      <fwb-modal v-if="isShowModal2" @close="isShowModal2 = false">
        <template #header>
          <div class="flex items-center text-lg">
            Thông tin
          </div>
        </template>
        <template #body>
          <!-- led: {{ led }} -->
          <!-- <fwb-input v-model="value1" label="sensor " size="sm" /> -->
          <div class="text-xl">

          <div v-if="typeOpenDetail === 'led'">
            Trạng thái: {{ (led?.device_status?.type || "chưa nhận dữ liệu") + " " + (led?.device_status?.value || "") }}
          </div>
          
          <div class="h-5"></div>
          <div v-if="typeOpenDetail === 'sensor'">
            <!-- dht: {{ dht }} -->
            <div class="mb-4 flex gap-1 items-center">
              Độ ẩm:<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 14.5714C20 18.7526 16.3364 22 12 22C7.66359 22 4 18.7526 4 14.5714C4 12 5.30472 9.45232 6.71637 7.42349C8.1468 5.36767 9.79177 3.69743 10.6777 2.85537M20 14.5714L10.6777 2.85537M20 14.5714C20 12 18.6953 9.45232 17.2836 7.42349C15.8532 5.36767 14.2082 3.69743 13.3223 2.85537C12.5778 2.14778 11.4222 2.14778 10.6777 2.85537M20 14.5714L10.6777 2.85537" stroke="#33363F" stroke-width="2"/>
                <path d="M12 18C11.4747 18 10.9546 17.8965 10.4693 17.6955C9.98396 17.4945 9.54301 17.1999 9.17157 16.8284C8.80014 16.457 8.5055 16.016 8.30448 15.5307C8.10346 15.0454 8 14.5253 8 14" stroke="#33363F" stroke-width="2" stroke-linecap="round"/>
                </svg> {{ dht && Number(dht.device_status.value[0]).toFixed(0) || 0 }} %.
            </div>
            <div class="mb-4 flex gap-1 items-center">
              Nhiệt độ:<svg width="24px" height="24px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M440.277481 390.185208V626.592988l-83.151447 60.801898L323.222878 776.847429l41.997715 137.757747 84.311922 59.814055 101.041317 10.869471 94.270275-53.394674s50.168999-82.211558 51.633181-88.224932c1.464182-6.013375-3.500609-108.544448-5.700078-114.164603s-25.11487-62.950217-25.11487-62.950217l-72.809466-51.150448 0.127876-218.987856" fill="#5FCEFF" /><path d="M432.876651 310.262633h160.100902V377.234554h-160.100902z" fill="#FFB578" /><path d="M440.277481 233.536961h143.860635V300.508882h-143.860635z" fill="#FF4893" /><path d="M512.911117 1007.651038c-116.942712 0-212.082545-95.139833-212.082545-212.082545 0-77.224389 42.592339-148.588855 109.653773-185.669732V117.793088c0-56.49567 45.949087-102.460741 102.428772-102.460741s102.428772 45.961874 102.428772 102.460741v492.102476c67.058237 37.071287 109.653773 108.43895 109.653773 185.672929 0 116.942712-95.139833 212.082545-212.082545 212.082545z m0-947.562049c-31.799594 0-57.67213 25.885324-57.67213 57.704099v505.813993a22.384715 22.384715 0 0 1-12.921882 20.284349c-58.762274 27.391065-96.731891 86.926989-96.731891 151.677063 0 92.262621 75.063282 167.325903 167.325903 167.325903s167.325903-75.060086 167.325903-167.325903c0-64.762861-37.96642-124.301982-96.725497-151.677063a22.36873 22.36873 0 0 1-12.928276-20.284349V117.793088c0-31.818776-25.872536-57.704099-57.67213-57.704099z" fill="#4F46A3" /><path d="M512.911117 933.77061c-74.193725 0-134.557647-60.37671-134.557647-134.589617 0-52.055172 30.517636-99.935188 77.748681-121.97144a22.378321 22.378321 0 1 1 18.925666 40.562306c-31.540645 14.715345-51.917705 46.671587-51.917705 81.412331 0 49.532815 40.284175 89.832974 89.801005 89.832975s89.801005-40.296962 89.801006-89.832975a22.378321 22.378321 0 1 1 44.756642 0c0 74.209709-60.363922 134.586419-134.557648 134.58642zM512.911117 179.173626H432.860666a22.378321 22.378321 0 1 1 0-44.756642h80.050451a22.378321 22.378321 0 1 1 0 44.756642zM592.833692 255.899298H432.860666a22.378321 22.378321 0 1 1 0-44.756642h159.973026a22.378321 22.378321 0 1 1 0 44.756642zM592.833692 332.62497H432.860666a22.378321 22.378321 0 1 1 0-44.756642h159.973026a22.378321 22.378321 0 1 1 0 44.756642zM592.833692 409.350642H432.860666a22.378321 22.378321 0 1 1 0-44.756642h159.973026a22.378321 22.378321 0 1 1 0 44.756642z" fill="#4F46A3" /></svg> {{ dht && Number(dht.device_status.value[1]).toFixed(0) || 0 }} °C
            </div>
          </div>
        </div>

          <div class="h-5"></div>
        </template>
        <template #footer>
          <div class="flex justify-center">
            <fwb-button @click="isShowModal2 = false" color="green">
              Ok
            </fwb-button>
          </div>
        </template>
      </fwb-modal>
    </div>
  </div>
</template>
