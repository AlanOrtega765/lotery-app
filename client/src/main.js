import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import SocketIo from './plugins/Socket.io';
import './style.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTicket,
  faTrophy,
  faCircleXmark,
  faCircleCheck,
  faTriangleExclamation,
  faFaceSadCry,
  faUserSlash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add({
  faTicket,
  faTrophy,
  faCircleXmark,
  faCircleCheck,
  faTriangleExclamation,
  faFaceSadCry,
  faUserSlash
});

const app = createApp(App);

app.use(router);
app.use(SocketIo, {
  connection: 'http://localhost:8000',
  reconnection: false,
  options: {},
});
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
