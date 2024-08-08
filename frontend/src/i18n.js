import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    welcome: 'Welcome to Gluten Hack',
    home: 'This is the home page.',
    getStarted: 'Get Started',
    restaurantMenu: 'Restaurant Menu',
    createAccount: 'Create Account',
    login: 'Login',
    policy: 'Policy'
  },
  fr: {
    welcome: 'Bienvenue à Gluten Hack',
    home: 'Ceci est la page d\'accueil.',
    getStarted: 'Commencer',
    restaurantMenu: 'Carte restaurant',
    createAccount: 'Créer un compte',
    login: 'Connexion',
    policy: 'Politique'
  }
}

const i18n = createI18n({
  locale: 'en', // langue par défaut
  messages
})

export default i18n
