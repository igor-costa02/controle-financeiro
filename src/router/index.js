import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Reports from '../views/Reports.vue'
import Users from '../views/Users.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/reports',
      name: 'reports',
      component: Reports
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    }
  ]
})

export default router 