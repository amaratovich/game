
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/game', component: () => import('pages/GamePage.vue') },
      { path: '/rating', component: () => import('pages/Rating.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  },
  {
    path: '/game',
    component: () => import('pages/GamePage.vue')
  },
  {
    path: '/rating',
    component: () => import('pages/Rating.vue')
  },
]

export default routes
