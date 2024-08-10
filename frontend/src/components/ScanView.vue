<template>
  <div class="container text-center mt-5">
    <h2 class="text-white">Veuillez entrer un code-barre</h2>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Code-barres"
            v-model="barcode"
            @keypress="validateInput"
          />
        </div>
          <button class="btn btn-login rounded text-white" @click="submitBarcode">Envoyer</button>
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
  methods: {
    validateInput (event) {
      const charCode = event.keyCode ? event.keyCode : event.which
      if (charCode < 48 || charCode > 57) {
        event.preventDefault()
      }
    },
    async submitBarcode () {
      if (this.barcode) {
        console.log(`Code-barres détecté : ${this.barcode}`)
        this.errorMessage = ''
        this.glutenMessage = ''
        this.glutenAlertClass = ''
        try {
          const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${this.barcode}.json`)
          const data = await response.json()
          if (data.status === 1) {
            console.log('Informations sur le produit :', data.product)
            if (data.product.ingredients_text) {
              const ingredients = data.product.ingredients_text.toLowerCase()
              const glutenIndicators = ['gluten', 'wheat', 'barley', 'rye', 'oats', 'triticale', 'malt']
              const containsGluten = glutenIndicators.some((indicator) => ingredients.includes(indicator))
              if (containsGluten) {
                this.glutenMessage = 'Attention : Ce produit contient du gluten.'
                this.glutenAlertClass = 'alert-danger'
              } else {
                this.glutenMessage = 'Ce produit ne semble pas contenir de gluten.'
                this.glutenAlertClass = 'alert-success'
              }
              this.saveProductToDatabase(data.product.product_name, this.barcode, containsGluten)
            } else {
              this.glutenMessage = 'Les informations sur les ingrédients ne sont pas disponibles.'
              this.glutenAlertClass = 'alert-warning'
            }
          } else {
            this.errorMessage = 'Produit non trouvé.'
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données :', error)
          this.errorMessage = 'Erreur lors de la récupération des données.'
        }
      } else {
        this.errorMessage = 'Veuillez entrer un code-barres.'
      }
    },
    async saveProductToDatabase (name, barcode, containsGluten) {
      try {
        const response = await fetch('http://localhost:3000/products/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name,
            code_barre: barcode,
            gluten: containsGluten
          })
        })
        const result = await response.json()
        console.log('Produit ajouté à la base de données:', result)
      } catch (error) {
        console.error("Erreur lors de l'ajout du produit à la base de données :", error)
      }
    }
  }
}
</script>
