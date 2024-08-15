import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import UserRegister from '../components/UserRegister.vue'
import UserLogin from '../components/UserLogin.vue'
import UserProfile from '../components/UserProfile.vue'
import ResetPassword from '../components/ResetPassword.vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'
import MapView from '../components/MapView.vue'
import ScanView from '../components/ScanView.vue'
import NotFound from '../components/NotFound.vue'
import PrivacyPolicy from '../components/PrivacyPolicy.vue'
// import VracView from '../components/VracView.vue'
import store from '../store'

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },
  { path: '/privacy-policy', name: 'PrivacyPolicy', component: PrivacyPolicy },
  { path: '/register', name: 'UserRegister', component: UserRegister },
  { path: '/login', name: 'UserLogin', component: UserLogin },
  { path: '/profile', name: 'UserProfile', component: UserProfile, meta: { requiresAuth: true } },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/reset-password-form', component: ResetPasswordForm },
  { path: '/map', name: 'Map', component: MapView, meta: { requiresAuth: true } },
  { path: '/scan', name: 'ScanView', component: ScanView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  // { path: '/vrac', name: 'VracView', component: VracView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    await store.dispatch('checkAuthentication')
    const isAuthenticated = store.getters.isAuthenticated
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
