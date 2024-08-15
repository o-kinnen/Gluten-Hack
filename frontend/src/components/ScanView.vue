<template>
  <div class="container text-center mt-5">
    <img src="../../img/scan.gif" alt="Gluten Hack Logo" height="100" class="mb-3">
    <h2 class="text-white">Veuillez entrer un code-barres</h2>
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
      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
      <div v-if="glutenMessage" class="alert" :class="glutenAlertClass" mt-3>
        {{ glutenMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, numeric } from '@vuelidate/validators'

export default {
  name: 'ScanView',
  data () {
    return {
      barcode: '',
      errorMessage: '',
      glutenMessage: '',
      glutenAlertClass: ''
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
      this.errorMessage = ''
      this.glutenMessage = ''
      this.glutenAlertClass = ''
      try {
        const dbCheckResponse = await fetch(`${process.env.VUE_APP_URL_BACKEND}/products/check/${this.barcode}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        const dbCheckData = await dbCheckResponse.json()
        if (dbCheckData.exists) {
          if (dbCheckData.gluten) {
            this.glutenMessage = 'Attention : Ce produit contient du gluten.'
            this.glutenAlertClass = 'alert-danger'
          } else {
            this.glutenMessage = 'Ce produit ne semble pas contenir de gluten.'
            this.glutenAlertClass = 'alert-success'
          }
        } else {
          const apiResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${this.barcode}.json`)
          const apiData = await apiResponse.json()
          if (apiData.status === 1) {
            if (apiData.product.ingredients_text) {
              const ingredients = apiData.product.ingredients_text.toLowerCase()
              const glutenIndicators = ['gluten', 'wheat', 'barley', 'rye', 'oats', 'triticale', 'malt']
              const containsGluten = glutenIndicators.some((indicator) => ingredients.includes(indicator))
              if (containsGluten) {
                this.glutenMessage = 'Attention : Ce produit contient du gluten.'
                this.glutenAlertClass = 'alert-danger'
              } else {
                this.glutenMessage = 'Ce produit ne semble pas contenir de gluten.'
                this.glutenAlertClass = 'alert-success'
              }
              this.saveProductToDatabase(apiData.product.product_name, this.barcode, containsGluten)
            } else {
              this.glutenMessage = 'Les informations sur les ingrédients ne sont pas disponibles.'
              this.glutenAlertClass = 'alert-warning'
            }
          } else {
            this.errorMessage = 'Produit non trouvé.'
          }
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
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            name,
            code_barre: barcode,
            gluten: containsGluten
          })
        })
        if (response.ok) {
          console.log('Product successfully added to the database')
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du produit à la base de données :", error)
      }
    }
  }
}
</script>
