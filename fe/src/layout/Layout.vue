<script setup>
import Header from "./Header.vue";
import Sidebar from "./Sidebar.vue";
</script>
<template>
	<div class="layout-content">
		<Header />
		<div class="flex">
			<Sidebar />
      <div class="pt-3 w-[calc(100%-298px)] h-[calc(100vh-70px)]">
        <router-view></router-view>
      </div>
		</div>
	</div>
</template>