<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2 text-center">
        <h1 class="display-4 text-white">{{ $t('welcome') }}</h1>
        <img src="../../img/icone.gif" alt="Gluten Hack Logo" height="400" class="mb-3">
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12 col-md-4 text-center">
        <img src="../../img/scan.gif" alt="Image 1" height="300" class="mb-3"/>
        <p class="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris convallis iaculis diam non fermentum. Nullam bibendum vitae arcu et volutpat. Donec dapibus sagittis sapien ut faucibus. Donec luctus pharetra odio, sit amet malesuada arcu aliquet sed. Sed in turpis eu ipsum blandit egestas. Etiam id velit quis eros eleifend lobortis. </p>
      </div>
      <div class="col-12 col-md-4 text-center">
        <img src="../../img/map.gif" alt="Image 2" height="300" class="mb-3" />
        <p class="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris convallis iaculis diam non fermentum. Nullam bibendum vitae arcu et volutpat. Donec dapibus sagittis sapien ut faucibus. Donec luctus pharetra odio, sit amet malesuada arcu aliquet sed. Sed in turpis eu ipsum blandit egestas. Etiam id velit quis eros eleifend lobortis. </p>
      </div>
      <div class="col-12 col-md-4 text-center">
        <img src="../../img/icone.gif" alt="Image 3" height="300" class="mb-3" />
        <p class="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris convallis iaculis diam non fermentum. Nullam bibendum vitae arcu et volutpat. Donec dapibus sagittis sapien ut faucibus. Donec luctus pharetra odio, sit amet malesuada arcu aliquet sed. Sed in turpis eu ipsum blandit egestas. Etiam id velit quis eros eleifend lobortis. </p>
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
