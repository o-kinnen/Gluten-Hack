<template>
  <div class="container text-center mt-5">
    <img src="../../img/scan.gif" alt="Gluten Hack Logo" height="100" class="mb-3">
    <h2 class="text-white">Veuillez entrer ou scanner un code-barres</h2>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Code-barres"
            v-model="barcode"
            @keypress="validateInput"
            :class="{'is-invalid': v$.barcode.$error}"
            @blur="v$.barcode.$touch()"
          />
        </div>
        <div v-if="v$.barcode.$error" class="invalid-feedback">Le code-barres est requis et doit être composé uniquement de chiffres.</div>
        <button class="btn btn-login rounded text-white" @click="submitBarcode" :disabled="v$.barcode.$invalid">Envoyer</button>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-6 mt-3">
        <div id="interactive" class="viewport">
          <video v-if="!productImage" id="barcode-scanner" autoplay playsinline></video>
          <img v-if="productImage" :src="productImage" alt="Image du produit" class="img-fluid" />
        </div>
        <button class="btn btn-login rounded text-white mt-3 mb-3" @click="startScanner">Scanner</button>
      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
      <div v-if="glutenMessage" class="alert" :class="glutenAlertClass" mt-3>
        {{ glutenMessage }}
      </div>
        <div v-if="productName" class="mt-3">
          <p class="text-white">Données fournies par <a :href="'https://world.openfoodfacts.org/product/' + barcode" target="_blank" class="text-white">Open Food Facts</a>.</p>
          <p v-if="productImage !== defaultImage" class="text-white">Photo sous licence <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" class="text-white">CC BY-SA</a>.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Quagga from 'quagga'
import useVuelidate from '@vuelidate/core'
import { required, numeric } from '@vuelidate/validators'

export default {
  name: 'ScanView',
  data () {
    return {
      barcode: '',
      errorMessage: '',
      glutenMessage: '',
      glutenAlertClass: '',
      quaggaInitialized: false,
      videoStream: null,
      productImage: null,
      productName: '',
      defaultImage: require('../../img/scan.gif')
    }
  },
  validations () {
    return {
      barcode: { required, numeric }
    }
  },
  setup () {
    const v$ = useVuelidate()
    return { v$ }
  },
  methods: {
    validateInput (event) {
      const charCode = event.keyCode ? event.keyCode : event.which
      if (charCode < 48 || charCode > 57) {
        event.preventDefault()
      }
    },
    async submitBarcode () {
      this.v$.$touch()
      if (this.v$.barcode.$invalid) {
        this.errorMessage = 'Veuillez entrer un code-barres valide.'
        return
      }
      this.productImage = this.defaultImage
      this.analyzeBarcode()
    },
    startScanner () {
      if (this.productImage) {
        this.productImage = null
      }
      this.productName = ''
      Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('#interactive'),
          constraints: {
            facingMode: 'user'
          }
        },
        decoder: {
          readers: ['ean_reader', 'code_128_reader']
        }
      }, (err) => {
        if (err) {
          console.error(err)
          return
        }
        console.log('Scanner initialisé')
        Quagga.start()
        Quagga.onDetected(this.onBarcodeDetected)
        this.quaggaInitialized = true
      })
    },
    onBarcodeDetected (result) {
      if (result.codeResult && result.codeResult.code) {
        this.barcode = result.codeResult.code
        console.log('Code-barres détecté :', this.barcode)
        Quagga.stop()
        Quagga.offDetected(this.onBarcodeDetected)
        this.productImage = this.defaultImage
        this.analyzeBarcode()
      }
    },
    async analyzeBarcode () {
      this.errorMessage = ''
      this.glutenMessage = ''
      this.glutenAlertClass = ''
      try {
        const apiResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${this.barcode}.json`)
        const apiData = await apiResponse.json()
        if (apiData.status === 1) {
          this.productName = apiData.product.product_name || 'Produit'
          const ingredients = apiData.product.ingredients_text?.toLowerCase()
          const glutenIndicators = ['gluten', 'wheat', 'barley', 'rye', 'oats', 'triticale', 'malt', 'wheat flour', 'whole wheat', 'enriched wheat', 'wheat starch', 'wheat germ', 'wheat bran', 'durum', 'semolina', 'spelt', 'farro', 'einkorn', 'kamut', 'barley malt', 'barley flour', 'barley extract', 'barley grass', 'barley flakes', 'rye flour', 'rye bread', 'rye beer', 'oats', 'oat bran', 'oat flour', 'oatmeal', 'malt extract', 'malt syrup', 'malt flavoring', 'malt vinegar', 'maltodextrin', 'triticale', 'emmer', 'freekeh', 'bulgur', 'graham flour', 'hydrolyzed wheat protein', 'textured vegetable protein (TVP)', 'modified wheat starch', 'miso', 'soy sauce', 'brewer’s yeast', 'couscous', 'beer', 'ale', 'lager', 'stout', 'porter', 'brewers yeast', 'distilled spirits', 'whiskey', 'vodka (à base de blé ou d’orge)', 'amidon de blé', 'extrait de malt', 'fécule de blé', 'son de blé', 'farine de blé', 'épeautre', 'seigle', 'orge', 'avoine', 'froment', 'triticale', 'épeautre', 'panko', 'farro', 'seitan', 'vital wheat gluten', 'tempeh (à base de blé)']
          const containsGluten = ingredients && glutenIndicators.some((indicator) => ingredients.includes(indicator))
          this.glutenMessage = containsGluten
            ? `${this.productName} : Ce produit semble contenir du gluten.`
            : `${this.productName} : Ce produit ne semble pas contenir de gluten.`
          this.glutenAlertClass = containsGluten ? 'alert-danger' : 'alert-success'
          this.productImage = apiData.product.image_url || this.defaultImage
          this.saveProductToDatabase(apiData.product.product_name, this.barcode, containsGluten)
        } else {
          this.errorMessage = 'Produit non trouvé.'
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error)
        this.errorMessage = 'Erreur lors de la récupération des données.'
      }
    },
    async saveProductToDatabase (name, barcode, containsGluten) {
      try {
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/products/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, barcode, gluten: containsGluten })
        })
        if (response.ok) {
          console.log('Produit ajouté avec succès')
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du produit à la base de données :", error)
      }
    }
  },
  beforeUnmount () {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop())
    }
    if (this.quaggaInitialized) {
      Quagga.stop()
      Quagga.offDetected(this.onBarcodeDetected)
    }
  }
}
</script>

<style scoped>
#interactive {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 300px;
  margin: 0 auto;
  border: 2px solid black;
  overflow: hidden;
}

#interactive video, #interactive img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
