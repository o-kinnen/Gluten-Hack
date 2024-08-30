<template>
    <div class="container-fluid text-center mt-5">
      <h2 class="text-white mb-4">Dernières infos sur le gluten</h2>
      <div v-if="loading" class="text-white">
        <p>Chargement des informations...</p>
      </div>
      <div v-else>
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        <div v-if="articles.length > 0" class="row">
          <div class="col-md-4 col-sm-6 mb-4" v-for="article in articles" :key="article.url">
            <div class="card h-100">
              <img :src="article.image" class="card-img-top" alt="Article Image" v-if="article.image">
              <div class="card-body text-white">
                <h5 class="card-title">{{ article.title }}</h5>
                <p class="card-text">{{ article.description }}</p>
              </div>
              <div class="card-footer text-center">
                <a :href="article.url" class="btn btn-login text-white" target="_blank">Lire l'article</a>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-white">Aucune information disponible pour le moment.</p>
        </div>
      </div>
    </div>
  </template>
<script>
export default {
  name: 'NewView',
  data () {
    return {
      articles: [],
      loading: true,
      errorMessage: ''
    }
  },
  methods: {
    async fetchGlutenNews () {
      try {
        const response = await fetch(
          `http://api.mediastack.com/v1/news?access_key=${process.env.VUE_APP_MEDIASTACK_API_KEY}&keywords=gluten&limit=6&sort=published_desc`)
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des informations')
        }
        const data = await response.json()
        const uniqueArticles = data.data.filter((article, index, self) =>
          index === self.findIndex((t) => t.url === article.url)
        )
        this.articles = uniqueArticles
        this.loading = false
      } catch (error) {
        this.errorMessage = error.message
        this.loading = false
      }
    }
  },
  created () {
    this.fetchGlutenNews()
  }
}
</script>
<style scoped>
.container-fluid {
    max-width: 1200px;
    margin: 0 auto;
  }

.card {
    border-radius: 15px;
    overflow: hidden;
    border: none;
    background-color: #BA9371;
}

.image-container {
    border-bottom: 5px solid #783D1A;
}

.card-body {
    background-color: #783D1A;
}

.card-footer {
    background-color: #BA9371;
}

.card img {
    height: 200px;
    object-fit: cover;
    width: 100%;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    margin-bottom: 15px;
}

.alert {
    background-color: #f8d7da;
    color: #721c24;
}

</style>
