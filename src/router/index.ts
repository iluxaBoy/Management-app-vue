import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/project/:id',
      name: 'project',
      component: () => import('@/views/ProjectView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/projects',
    },
  ],
})

export default router
