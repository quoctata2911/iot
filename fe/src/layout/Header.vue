<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import Dropdown from "@/components/dropdown/Dropdown.vue";
import { removeAccessToken } from "@/composables/useLocalStorage";
import router from "@/helper/router";

const authStore = useUserStore();
const info = ref();
const isShowDropDown = ref(false);
const getProfile = async () => {
	const response = await authStore.getProfile();
	if (response) {
		info.value = response;
	}
};

const toggleDropDown = () => {
	isShowDropDown.value = !isShowDropDown.value;
};

const logout = () => {
	removeAccessToken();
	window.location.href = "./login";
};

getProfile();
</script>
<template>
	<div class="header bg-primary flex justify-between items-center px-4">
		<div class="text-white font-bold text-2xl">Quản lý thiết bị IOT</div>
		<div class="flex items-center gap-2 font-semibold">
			<Dropdown :isShowDropDown="isShowDropDown" :toggleDropDown="toggleDropDown" :position="'bottom'" width="200px">
				<template #triggerButton>
					<div class="bg-white h-10 w-10 rounded-full">
						<img class="max-w-full h-full rounded-full object-cover" src="https://vnn-imgs-f.vgcloud.vn/2020/03/23/11/trend-avatar-1.jpg" alt="avt" />
					</div>
				</template>
				<template #content>
					<div class="flex flex-col p-1 gap-2 items-center">
						<div class="flex items-center bg-hover justify-between px-4 py-3 rounded-md cursor-pointer w-full text-center">
							<div>Setting</div>
							<div><img class="w-4" src="../assets/svg/arrowRight.svg" alt="" /></div>
						</div>
						<div class="flex items-center bg-hover justify-between px-4 py-3 rounded-md cursor-pointer w-full text-center" @click="logout">
							<div>Logout</div>
							<div><img class="w-4" src="../assets/svg/arrowRight.svg" alt="" /></div>
						</div>
					</div>
				</template>
			</Dropdown>
		</div>
	</div>
</template>
<style scoped>
.header {
	height: 56px;
	width: 100%;
	background: linear-gradient(0deg,rgba(13,13,13,.76) 0%,rgba(13,13,13,.76) 100%),linear-gradient(90deg,#f926e1 .22%,#2ab5fb 99.76%);
	
}

.bg-hover:hover {
	background: red;
}
</style>