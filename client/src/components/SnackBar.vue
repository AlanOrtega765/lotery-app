<script setup>
defineProps({
  color: String,
  iconName: String,
  message: String,
});
</script>

<template>
  <div
    class="absolute flex justify-center items-center bottom-10 text-just-white px-4 py-3 rounded-md"
    :class="`bg-${color}`"
  >
    <font-awesome-icon class="text-xl mr-4" :icon="iconName" />
    <span>{{ message }}</span>
  </div>
</template>
