
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [

      {path: '', component: () => import('pages/Index.vue')},
      {path: '/swordfish_pre', component: () => import('src/pages/Lab/Swordfish3D_previous')},
      {path: '/lab01', component: () => import('src/pages/Lab/lab01')},
      {path: '/DiningTable', component: () => import('pages/DiningTablePage.vue')},
      {path: '/Pisirian', component: () => import('src/pages/Pisirian.vue')},
       {path: '/Market', component: () => import('src/pages/Market.vue')},
      {path: '/Swordfish', component: () => import('src/pages/Swordfish.vue')},
      {path: '/Final', component: () => import('src/pages/Final.vue')},
      {path: '/swordfishChallenge', component: () => import('src/pages/swordfishChallenge.vue')},
      {path: '/Challenge', component: () => import('src/pages/swordfish_Index.vue')},






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
