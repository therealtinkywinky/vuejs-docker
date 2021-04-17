import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/connect'
  },
  {
    path: '/connect',
    name: 'Connect',
    component: function() {
      return import('../views/Connect.vue')
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: function() {
      return import('../views/Dashboard.vue')
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
