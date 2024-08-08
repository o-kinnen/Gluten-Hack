<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2 text-center">
        <h1 class="display-4 text-white">{{ $t('welcome') }}</h1>
        <img src="../../img/icone.png" alt="Gluten Hack Logo" height="100" class="mb-3">
        <p class="lead text-white">{{ $t('home') }}</p>
        <button class="btn-color rounded text-white" @click="navigateToRegister">{{ $t('getStarted') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    navigateToRegister () {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
/* Ajoutez vos styles ici si nécessaire */
.btn-color {
  background-color: #783D1A;
  border: none;
}
</style>
