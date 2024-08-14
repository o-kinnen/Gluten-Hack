const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      })
    ]
  },
  devServer: {
    port: 8080, // Définit le port pour le serveur de développement
    proxy: {
      '^/api': {
        target: process.env.VUE_APP_URL_BACKEND,
        changeOrigin: true,
        secure: false // Utilisé uniquement si vous avez un certificat auto-signé
      }
    }
  }
})
