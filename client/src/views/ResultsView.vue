<script setup>
import Ticket from '../components/Ticket.vue';
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';

const socket = inject('socket');
const router = useRouter();

const maxPlayers = ref(null);
const players = ref(null);
const playerWinner = ref('');
const ticketWinner = ref(null);
const modal = ref(false);
const timer = ref(5);

const openModal = () => {
  setTimeout(() => {
    modal.value = true;
    disconnectPlayer();
  }, 4000);
};

const disconnectPlayer = () => {
  setInterval(() => {
    timer.value--;
    if (timer.value === 0) {
      socket.emit('game over');
      router.push({
        path: '/',
        replace: true,
      });
    }
  }, 1000);
};

socket.emit('results');

socket.on('all results', (value1, value2, value3, value4) => {
  maxPlayers.value = value1;
  players.value = value2;
  ticketWinner.value = value3;
  playerWinner.value = value4;
});

openModal();
</script>

<template>
  <main class="relative">
    <div class="flex items-center mt-[34px] ml-[50px]">
      <h1 class="text-2xl font-bold">Resultados</h1>
      <font-awesome-icon class="w-[36px] h-[32px] ml-4" icon="trophy" />
    </div>
    <div class="flex flex-col items-center">
      <h2 class="text-xl font-bold">Ticket Ganador</h2>
      <Ticket class="mt-2" :ticket="ticketWinner" />
    </div>
    <div
      class="absolute flex justify-evenly items-center bottom-0 h-[260px] w-full rounded-b-3xl bg-just-white"
    >
      <div class="inline-flex flex-col items-center" v-for="player in players">
        <h3 class="text-xl font-bold">{{ player.playername }}</h3>
        <div class="relative mt-2">
          <Ticket class="opacity-30" :ticket="player.ticket" />
          <font-awesome-icon
            v-if="
              JSON.stringify(player.ticket) === JSON.stringify(ticketWinner)
            "
            class="absolute w-[55px] h-[55px] text-green top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
            icon="circle-check"
          />
          <font-awesome-icon
            v-else
            class="absolute w-[55px] h-[55px] text-red top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
            icon="circle-xmark"
          />
        </div>
      </div>
    </div>
    <div
      v-if="modal"
      class="absolute top-0 left-0 flex justify-center items-center w-[800px] h-[600px] bg-just-black/60 rounded-3xl"
    >
      <div class="w-[538px] h-[346px] bg-just-white rounded-3xl">
        <div class="text-center mt-14">
          <span class="block text-4xl font-bold">¡Jugador Ganador!</span>
          <span v-if="playerWinner" class="text-3xl">{{ playerWinner }}</span>
          <span v-else class="text-3xl">Nadie :(</span>
        </div>
        <div class="flex flex-col items-center mt-10">
          <span class="text-xl">Volviendo al menú principal</span>
          <span class="font-bold text-2xl mt-3">{{ timer }}</span>
        </div>
      </div>
    </div>
  </main>
</template>
