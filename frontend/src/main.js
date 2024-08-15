import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap'
import '@popperjs/core'
import './assets/style.css'

createApp(App)
  .use(router)
  .use(store)
  .use(i18n)
  .mount('#app')
