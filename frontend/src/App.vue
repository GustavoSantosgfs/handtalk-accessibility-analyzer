<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />
    <RouterView />
    <footer class="mt-auto py-3 bg-light border-top">
      <div class="container text-center">
        <p class="text-muted mb-0 small">
          Hand Talk - Analisador de Acessibilidade &copy; {{ new Date().getFullYear() }}
        </p>
      </div>
    </footer>
  </div>
</template>
