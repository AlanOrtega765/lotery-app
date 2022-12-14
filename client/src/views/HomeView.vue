<script setup>
import Ticket from '../components/Ticket.vue';
import SnackBarVue from '../components/SnackBar.vue';

import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';

const socket = inject('socket');
const router = useRouter();

const remainingPlayers = ref(0);
const playerDisconnectMessage = ref('');
const timer = ref(30);
const intervalID = ref(null);
const ticketElements = ref(null);
const tickets = ref([]);
const ticketSelected = ref(null);
const playerStatus = ref({});
const playerNameInTurn = ref('');
const transparentBg = ref(null);
const gameStarted = ref(false);

const stopTimer = () => {
  clearInterval(intervalID.value);
  intervalID.value = null;
};

const resetTimer = () => {
  timer.value = 30;
};

const confirmTurn = () => {
  socket.emit('turn confirmed');
  socket.emit('set player status to ready');
  socket.emit('assing ticket', ticketSelected.value);
  socket.emit('start turn');
};

const selectTicket = (ticketId) => {
  ticketSelected.value = ticketId;
};

socket.emit('remaining players');

socket.on('send remaining players', (value) => {
  remainingPlayers.value = value;
});

socket.on('on player disconnect', (message) => {
  socket.emit('remaining players');
  playerDisconnectMessage.value = message;
  setTimeout(() => {
    playerDisconnectMessage.value = '';
  }, 4000);
});

socket.emit('starting game');
socket.emit('start turn');
socket.on('start timer', () => {
  intervalID.value = setInterval(() => {
    timer.value--;
    if (timer.value === 0) {
      stopTimer();
    }
  }, 1000);
});
socket.on('reset timer', () => {
  stopTimer();
  resetTimer();
});

socket.on('game started', () => (gameStarted.value = true));

socket.on('tickets created', (data) => (tickets.value = data));

socket.on('set player status in turn', (status) => {
  playerStatus.value = status;
});
socket.on('set player status waiting their turn', (status) => {
  playerStatus.value = status;
});
socket.on('player is ready', (status) => (playerStatus.value = status));
socket.on(
  'send player name in turn',
  (playername) => (playerNameInTurn.value = playername)
);
socket.on('ticket selected', (ticketId) => {
  ticketElements.value[ticketId].refTicket.classList.add('opacity-30');
  transparentBg.value[ticketId].classList.remove('hidden');
  transparentBg.value[ticketId].classList.add('visible');
});

socket.on('calculated results', () =>
  router.push({
    path: '/results',
    replace: true,
  })
);
</script>

<template>
  <main class="relative px-[50px]">
    <div v-if="gameStarted">
      <div class="flex justify-between items-center mt-[34px]">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold">Escoge un ticket</h1>
          <font-awesome-icon class="ml-4 w-[36px] h-[32px]" icon="ticket" />
        </div>
        <span v-if="playerStatus.choosing" class="text-2xl font-bold">{{
          timer
        }}</span>
      </div>
      <div
        class="relative flex justify-evenly items-center h-[260px] shadow-inner rounded-md bg-just-white mt-11"
      >
        <div v-for="(ticket, index) in tickets" :key="index">
          <div class="relative flex flex-col items-center">
            <Ticket
              ref="ticketElements"
              :class="ticketSelected === index ? 'opacity-30' : ''"
              :ticket="ticket"
              @click="selectTicket(index)"
            />
            <span class="text-sm font-medium mt-1">Ticket {{ index + 1 }}</span>
            <div
              ref="transparentBg"
              class="absolute top-0 left-0 bg-transparent w-full h-full hidden"
            ></div>
          </div>
        </div>
        <div
          v-if="!playerStatus.choosing"
          class="absolute flex justify-center items-center text-xl text-just-white font-bold w-full h-full bg-just-black/70 rounded-md"
        >
          <span>¡{{ playerNameInTurn }} está seleccionando!</span>
        </div>
      </div>
      <div class="flex justify-between items-center mt-2">
        <span v-if="!playerStatus.ready" class="text-xl font-semibold">
          {{ playerStatus.choosing ? 'Tu turno' : 'Esperando tu turno...' }}
        </span>
      </div>
      <div class="mt-8">
        <span
          v-if="playerStatus.choosing"
          class="block text-xl font-medium text-center"
          >Selecciona un ticket</span
        >
        <span
          v-if="playerStatus.ready"
          class="block text-xl font-medium text-center"
          >Ticket seleccionado: {{ ticketSelected + 1 }}</span
        >
        <span
          v-if="playerStatus.ready"
          class="block text-xl font-medium text-center"
          >Esperando a los demas jugadores...</span
        >
        <button
          v-if="
            playerStatus.waiting ? false : playerStatus.ready ? false : true
          "
          class="block mx-auto mt-[26px] w-[100px] h-[38px] rounded-md text-just-white text-lg font-semibold bg-very-soft-red hover:bg-soft-red"
          @click="confirmTurn"
        >
          Confirmar
        </button>
      </div>
    </div>
    <div
      v-if="remainingPlayers !== 0"
      class="absolute top-0 left-0 flex justify-center items-center w-[800px] h-[600px] bg-just-black/60 rounded-3xl"
    >
      <div
        class="flex justify-center items-center w-[538px] h-[346px] bg-just-white rounded-3xl"
      >
        <span class="text-2xl"
          >Esperando {{ remainingPlayers }} jugadores...</span
        >
      </div>
    </div>
  </main>
  <SnackBarVue
    v-if="playerDisconnectMessage"
    color="soft-black"
    icon-name="user-slash"
    :message="playerDisconnectMessage"
  />
</template>
