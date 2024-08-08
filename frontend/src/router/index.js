import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import UserRegister from '../components/UserRegister.vue'
import UserLogin from '../components/UserLogin.vue'
import UserProfile from '../components/UserProfile.vue'
import ResetPassword from '../components/ResetPassword.vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },
  { path: '/register', name: 'UserRegister', component: UserRegister },
  { path: '/login', name: 'UserLogin', component: UserLogin },
  { path: '/profile', name: 'UserProfile', component: UserProfile },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/reset-password-form', component: ResetPasswordForm }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
