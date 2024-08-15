<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-fond text-white rounded mb-4">
    <div class="card p-4 bg-form rounded" style="width: 400px;">
      <div class="text-center mb-3">
        <h3 class="text-white">Réinitialiser le mot de passe</h3>
      </div>
      <form @submit.prevent="sendResetLink">
        <div class="mb-3">
          <label for="email" class="form-label text-white">Email</label>
          <input type="email" v-model="email" class="form-control" id="email" placeholder="exemple@domaine.com" :class="{'is-invalid': v$.email.$error}" @blur="v$.email.$touch()" >
          <div v-if="v$.email.$error" class="invalid-feedback">L'email doit être valide.</div>
        </div>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
        </div>
        <div class="d-grid gap-2 mt-3">
          <button type="submit" class="btn btn-login rounded text-white" :disabled="v$.$invalid">Réinitialiser le mot de passe</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default {
  name: 'ResetPassword',
  data () {
    return {
      email: '',
      errorMessage: '',
      successMessage: ''
    }
  },
  validations () {
    return {
      email: { required, email }
    }
  },
  setup () {
    const v$ = useVuelidate()
    return { v$ }
  },
  methods: {
    async sendResetLink () {
      this.errorMessage = ''
      this.successMessage = ''
      this.v$.$touch()

      if (this.v$.$invalid) {
        return
      }

      try {
        const response = await fetch(`${process.env.VUE_APP_URL_BACKEND}/users/send-reset-link`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email }),
          credentials: 'include'
        })
        const data = await response.json()
        if (data.success) {
          this.successMessage = 'Un email de réinitialisation de mot de passe a été envoyé.'
        } else {
          this.errorMessage = data.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation.'
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la communication avec le serveur. Veuillez réessayer plus tard.'
      }
    }
  }
}
</script>
