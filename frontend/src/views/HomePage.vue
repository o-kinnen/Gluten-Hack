<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2 text-center">
        <h1 class="display-4 text-white">{{ $t('welcome') }}</h1>
        <img src="../../img/icone.gif" alt="Gluten Hack Logo" height="400" class="mb-3">
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
