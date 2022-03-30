import Vue from 'vue'
import VueRouter from 'vue-router'
import Wealth from '../views/Wealth'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/wealth/'
  },
  {
    path: '/wealth/',
    component: Wealth,
    meta:{
     title:'首页'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
