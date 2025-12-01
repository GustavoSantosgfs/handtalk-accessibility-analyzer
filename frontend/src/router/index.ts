import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import HistoryView from '../views/HistoryView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Analisador - Hand Talk Acessibilidade' }
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView,
      meta: { title: 'Histórico - Hand Talk Acessibilidade' }
    }
  ]
});

router.beforeEach((to) => {
  document.title = (to.meta.title as string) || 'Hand Talk Analisador de Acessibilidade';
});

export default router;
