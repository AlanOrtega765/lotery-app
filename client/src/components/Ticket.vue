<script setup>
import { ref } from 'vue';

defineProps({
  ticket: Array,
});

const refTicket = ref(null);

defineExpose({ refTicket });
</script>
<template>
  <div
    ref="refTicket"
    class="grid grid-cols-2 place-items-center w-[87px] h-[196px] bg-soft-red/[15%] rounded-xl cursor-pointer"
  >
    <span
      class="flex justify-center items-center text-just-white bg-very-soft-red w-[30px] h-[30px] rounded-full text-md font-bold font-sans-serif"
      v-for="number in ticket"
      >{{ number }}</span
    >
  </div>
</template>
