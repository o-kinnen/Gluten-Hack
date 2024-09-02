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
        <img src="../../img/scan_couleur.png" alt="Image 3" height="300" class="mb-3" />
        <p class="text-white">Scannez ou entrez un code-barres pour obtenir des informations sur un produit. Nous vous aidons à vérifier si un article contient des traces de gluten.</p>
      </div>
      <div class="col-12 col-md-4 text-center">
        <img src="../../img/map_couleur.png" alt="Image 2" height="300" class="mb-3" />
        <p class="text-white">Envie d'un restaurant sans gluten ? Entrez un lieu pour découvrir des lieux de restauration affichées sur une carte interactive proposant des alternatives au gluten.</p>
      </div>
      <div class="col-12 col-md-4 text-center">
        <img src="../../img/news_couleur.png" alt="Image 1" height="300" class="mb-3"/>
        <p class="text-white">Découvrez les dernières actualités sur le gluten ! Nous proposons des articles récents et pertinents mises à jour.</p>
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
