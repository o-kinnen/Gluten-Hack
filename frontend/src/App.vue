<template>
  <div id="app" class="d-flex flex-column min-vh-100 background-page">
    <nav class="navbar navbar-expand-lg navbar-light background-nav">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img src="../img/logo.png" alt="Gluten Hack Logo">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/register" class="nav-link text-white">{{ $t('createAccount') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/login" class="nav-link text-white">{{ $t('login') }}</router-link>
            </li>
            <li class="nav-item">
              <select v-model="$i18n.locale" class="form-select">
                <option value="en" >English</option>
                <option value="fr">Français</option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container flex-grow-1 mt-4">
      <router-view />
    </div>
    <FooterPage />
  </div>
</template>

<script>
import FooterPage from './components/FooterPage.vue'

export default {
  name: 'App',
  components: {
    FooterPage
  }
}
</script>

<style>
.background-page {
  background-color: #BA9371;
}

.background-nav {
  background-color: #C56929;
}

.nav-link {
  color: #783D1A !important;
}

.navbar-brand img {
  height: 40px; /* Adjust the height of the logo as needed */
}

.form-select {
  background-color: #783D1A;
}
</style>
