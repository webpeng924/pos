import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/signPage',
    name: 'signPage',
    component: () => import('@/components/signAgreement.vue')
  },
  {
    path: '/sign',
    name: 'sign',
    component: () => import('@/components/signPage.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/card',
    name: 'card',
    component: () => import('@/views/card/cardHome.vue')
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/order/order.vue')
  },
  {
    path: '/showroom',
    name: 'showroom',
    component: () => import('@/views/showroom/showroom.vue')
  },
  {
    path: '/members',
    name: 'members',
    component: () => import('@/views/members/members.vue')
  },
  {
    path: '/daily',
    name: 'daily',
    component: () => import('@/views/daily/daily.vue')
  },
  {
    path: '/brand',
    name: 'brand',
    component: () => import('@/views/brand/brand.vue')
  },
  {
    path: '/more',
    name: 'more',
    component: () => import('@/views/more/more.vue')
  },
  {
    path: '/store',
    name: 'store',
    component: () => import('@/views/store/store.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  let user = sessionStorage.getItem('userInfo')
  let shop = sessionStorage.getItem('shopInfo')
  if ((user && shop) || to.path == '/login' || to.path == '/signPage' || to.path == '/sign') {
    next()
  } else {
    next({
      path: '/login'
    })
  }
})

export default router
