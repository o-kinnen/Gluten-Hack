<template>
  <div class="d-flex justify-content-center align-items-center min-vh-50 bg-fond text-white rounded mb-4">
    <div class="card p-4 bg-form rounded" style="width: 400px;">
      <div class="text-center mb-3">
        <img src="../../img/icone.png" alt="Gluten Hack Logo" height="80" class="mb-3">
        <h3 class="text-white">Bienvenue {{ name }} !</h3>
      </div>
      <div class="text-center">
        <button @click="logout" class="btn btn-color rounded text-white mb-3">Se déconnecter</button>
      </div>
      <div class="text-center">
        <button @click="deleteAccount" class="btn btn-color rounded text-white">Supprimer le compte</button>
      </div>
      <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      <div v-if="products.length > 0" class="mt-4">
        <h4 class="text-white text-center">Vos produits scannés </h4>
        <table class="table custom-table text-white">
          <thead>
            <tr>
              <th scope="col" class="text-center">Produit</th>
              <th scope="col" class="text-center">Gluten</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td class="text-center">{{ product.name }}</td>
              <td class="text-center">{{ product.gluten ? 'Oui' : 'Non' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="text-center mt-3">
          <button @click="deleteHistory" class="btn btn-color rounded text-white mb-3">Supprimer l'historique</button>
        </div>
      </div>
      <div v-else class="mt-4">
        <p class="text-center text-white">Aucun produit scanné pour l'instant.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data () {
    return {
      name: '',
      email: '',
      errorMessage: '',
      products: []
    }
  },
  methods: {
    async fetchProfile () {
      try {
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/users/profile`, {
          credentials: 'include'
        })
        const data = await response.json()
        if (response.ok) {
          this.name = data.name
          this.email = data.email
          this.fetchScannedProducts()
        } else {
          this.errorMessage = data.message || 'Erreur lors de la récupération des informations du profil.'
          this.$router.push('/login')
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la communication avec le serveur. Veuillez réessayer plus tard.'
      }
    },
    async fetchScannedProducts () {
      try {
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/products/user`, {
          credentials: 'include'
        })
        const data = await response.json()
        if (response.ok) {
          this.products = data.products
        } else {
          this.errorMessage = 'Erreur lors de la récupération des produits.'
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la communication avec le serveur.'
      }
    },
    async logout () {
      try {
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/users/logout`, {
          method: 'POST',
          credentials: 'include'
        })
        if (response.ok) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        } else {
          this.errorMessage = 'Erreur lors de la déconnexion.'
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la déconnexion.'
      }
    },
    async deleteAccount () {
      if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
        try {
          const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/users/delete`, {
            method: 'DELETE',
            credentials: 'include'
          })
          if (response.ok) {
            alert('Votre compte a été supprimé avec succès.')
            this.logout()
          } else {
            this.errorMessage = 'Erreur lors de la suppression du compte.'
          }
        } catch (error) {
          this.errorMessage = 'Erreur lors de la suppression du compte.'
        }
      }
    },
    async deleteHistory () {
      if (confirm('Êtes-vous sûr de vouloir supprimer votre historique de produits scannés ?')) {
        try {
          const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/products/user`, {
            method: 'DELETE',
            credentials: 'include'
          })
          if (response.ok) {
            alert('Historique supprimé avec succès.')
            this.products = []
          } else {
            this.errorMessage = 'Erreur lors de la suppression de l\'historique.'
          }
        } catch (error) {
          this.errorMessage = 'Erreur lors de la suppression de l\'historique.'
        }
      }
    }
  },
  created () {
    this.fetchProfile()
  }
}
</script>

<style scoped>
.custom-table {
  background-color: #783D1A;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 15px;
  overflow: hidden;
}

.custom-table th, .custom-table td {
  color: white;
  padding: 10px;
}

.custom-table th {
  background-color: rgba(0, 0, 0, 0.2);
}

.custom-table tr {
  background-color: #783D1A;
}

.custom-table tr:nth-child(even) {
  background-color: #783D1A;
}

.custom-table tr td {
  background-color: #783D1A;
}

.custom-table th:first-child {
  border-top-left-radius: 15px;
}

.custom-table th:last-child {
  border-top-right-radius: 15px;
}

.custom-table tr:last-child td:first-child {
  border-bottom-left-radius: 15px;
}

.custom-table tr:last-child td:last-child {
  border-bottom-right-radius: 15px;
}
</style>
