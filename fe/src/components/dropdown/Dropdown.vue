<script setup>
const props = defineProps(["width", "maxHeight","isShowDropDown", "className", "position", "placement", "toggleDropDown"]);
</script>

<template>
	<div :class="`relative inline-block text-left`">
		<div class="cursor-pointer" @click="toggleDropDown">
			<slot name="triggerButton" />
		</div>
		<div
			v-if="isShowDropDown"
			:style="`width: ${width}`"
			:class="`origin-top-right ${className} ${maxHeight || 'max-h-[200px]'}  overflow-auto min-w-full scrollbar absolute z-20 
      ${position === 'bottom' ? (placement === 'left' ? 'left-0 mt-2' : 'right-0 mt-2') : placement === 'right' ? 'bottom-[72px] left-0' : 'bottom-[72px] right-0'} 
      rounded-md shadow-lg bg-white border border-[#EAECF0] ring-opacity-10 focus:outline-none`"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabIndex="{-1}"
		>
			<div class="p-1" role="none">
				<slot name="content" />
			</div>
		</div>
	</div>
</template>