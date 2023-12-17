<script setup>
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

const sidebar = [
  { id: 1, tab: "Dashboard" },
  { id: 2, tab: "Device" },
  { id: 3, tab: "Room" },
];
</script>

<template>
  <div class="sidebar bg-white">
    <div
      class="main-sidebar h-full mt-3 w-[calc(100%-20px)] rounded-xl"
    >
      <div
        v-for="item in sidebar"
        :key="item.id"
        :class="`${route.path.includes(item.tab.toLowerCase()) ? 'bg-blue-300' : 'bg-white '}  mx-2 my-2 rounded-lg h-10 px-2 flex items-center cursor-pointer hover:bg-slate-400`"
        @click="router.push(`/${item.tab.toLowerCase()}`)"
      >
        <div>
          {{ item.tab }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.sidebar {
  height: calc(100vh - 70px);
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-sidebar {
	background: linear-gradient(0deg,rgba(13,13,13,.76) 0%,rgba(13,13,13,.76) 100%),linear-gradient(90deg,#f926e1 .22%,#2ab5fb 99.76%);
}
</style>
