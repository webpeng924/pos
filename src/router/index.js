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

//获取原型对象上的push函数
// const originalPush = VueRouter.prototype.push
// //修改原型对象中的push方法
// VueRouter.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err)
// }

router.beforeEach((to, from, next) => {
  let user = sessionStorage.getItem('userInfo')
  let shop = sessionStorage.getItem('shopInfo')
  if (to.path == '/login') {
    document.title = '登录'
  }
  if ((user && shop) || to.path == '/login' || to.path == '/signPage' || to.path == '/sign') {
    if (shop) {
      let shoptype = JSON.parse(shop).type_id
      if (shoptype == 1) {
        document.title = '诗泊蕾尔管理系统'
      } else {
        document.title = '诗臻泊管理系统'
      }
    }
    next()
  } else {
    next({
      path: '/login'
    })
  }
})

export default router
