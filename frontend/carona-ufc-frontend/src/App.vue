<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Header, Footer } from './components/layout/'
</script>

<template>
  <div id="app-container">
    <Header />
    <main class="main-content flex items-center justify-center">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
