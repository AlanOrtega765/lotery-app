<script setup>
import SnackBarVue from '../components/SnackBar.vue';

import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';

const socket = inject('socket');
const router = useRouter();

const playerName = ref('');
const messages = ref({
  error: '',
  warning: '',
});

// Methods
const addPlayer = () => {
  socket.emit('add player', playerName.value);
  playerName.value = '';
};

// Socket.io Events
socket.on('player added', () =>
  router.push({
    path: '/home',
    replace: true,
  })
);

socket.on('error on add player', (message) => {
  messages.value.error = message;
  setTimeout(() => {
    messages.value.error = '';
  }, 4000);
});

socket.on('player cannot enter', (message) => {
  messages.value.warning = message;
  setTimeout(() => {
    messages.value.warning = '';
  }, 4000);
});

socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') socket.connect();
})
</script>

<template>
  <main class="flex justify-center items-center">
    <div class="flex flex-col justify-between w-[454px] h-[230px]">
      <h1 class="text-4xl font-bold">¡Bienvenido a la lotería!</h1>
      <div class="flex flex-col">
        <input
          class="w-[270px] h-[40px] rounded-[20px] px-5 text-lg placeholder:text-light-gray font-medium outline-none drop-shadow-1 mx-auto"
          type="text"
          v-model="playerName"
          placeholder="Ingresa tu nombre"
        />
      </div>
      <button
        class="bg-very-soft-red hover:bg-soft-red w-[110px] h-[37px] mx-auto text-just-white font-semibold rounded-[5px]"
        @click="addPlayer"
      >
        Entrar
      </button>
    </div>
  </main>
  <SnackBarVue
    v-if="messages.error"
    color="error"
    icon-name="triangle-exclamation"
    :message="messages.error"
  />
  <SnackBarVue
    v-if="messages.warning"
    color="warning"
    icon-name="face-sad-cry"
    :message="messages.warning"
  />
</template>
