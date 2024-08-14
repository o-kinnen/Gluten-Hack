<template>
  <footer class="footer mt-auto py-3 background-footer text-white">
    <div class="text-center mt-4">
      <p>&copy; 2024 Gluten Hack <router-link to="/privacy-policy" class="text-white">{{ $t('policy') }}</router-link></p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterPage'
}
</script>
