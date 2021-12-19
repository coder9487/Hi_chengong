
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      
      {path: '', component: () => import('pages/Index.vue')},
      {path: '/market-page', component: () => import('pages/MarketPage.vue')},
      {path: '/pisirian', component: () => import('pages/pisirian.vue')},
      {path: '/lantern', component: () => import('pages/lantern.vue')},
      {path: '/swordfish', component: () => import('pages/swordfish.vue')},
      
    
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
