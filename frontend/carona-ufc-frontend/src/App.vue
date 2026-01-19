<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { toast } from 'vue3-toastify'
import { Header, Footer } from './components/layout/'

onMounted(() => {
  const flashError = sessionStorage.getItem('flash_error')
  if (flashError) {
    toast.error(flashError)
    sessionStorage.removeItem('flash_error')
  }
})

</script>

<template>
  <div id="app-container">
    <Header />
    <main class="main-content flex items-start justify-center">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
