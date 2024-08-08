import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import UserRegister from '../components/UserRegister.vue'
import UserLogin from '../components/UserLogin.vue'
import UserProfile from '../components/UserProfile.vue'
import ResetPassword from '../components/ResetPassword.vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'
import MapView from '../components/MapView.vue'

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },
  { path: '/register', name: 'UserRegister', component: UserRegister },
  { path: '/login', name: 'UserLogin', component: UserLogin },
  { path: '/profile', name: 'UserProfile', component: UserProfile },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/reset-password-form', component: ResetPasswordForm },
  { path: '/map', name: 'Map', component: MapView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const loggedIn = !!localStorage.getItem('token')
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router
