import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    welcome: 'Welcome to Gluten Hack',
    restaurantMenu: 'Restaurant Menu',
    createAccount: 'Create Account',
    login: 'Login',
    policy: 'Policy',
    welcomeForm: 'Welcome back !',
    password: 'Password'
  },
  fr: {
    welcome: 'Bienvenue sur Gluten Hack',
    restaurantMenu: 'Carte restaurant',
    createAccount: 'Créer un compte',
    login: 'Connexion',
    policy: 'Politique',
    welcomeForm: 'Te revoilà !',
    password: 'Mot de passe'
  }
}

const i18n = createI18n({
  locale: 'fr',
  messages
})

export default i18n
