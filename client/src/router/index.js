import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
} from 'vue-router';
import LoginView from '../views/LoginView.vue';

const HomeView = () => import('../views/HomeView.vue');
const ResultsView = () => import('../views/ResultsView.vue');

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL), // createMemoryHistory -> Para ocultar el history
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/results',
      name: 'results',
      component: ResultsView,
    },
  ],
});

export default router;
