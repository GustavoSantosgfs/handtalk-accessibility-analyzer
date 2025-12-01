<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <RouterLink to="/" class="navbar-brand d-flex align-items-center gap-2">
          <span class="fs-4" aria-hidden="true">♿</span>
          <span>Analisador de Acessibilidade</span>
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Alternar navegação"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink
                to="/"
                class="nav-link"
                :class="{ active: route.path === '/' }"
                :aria-current="route.path === '/' ? 'page' : undefined"
              >
                Analisador
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                to="/history"
                class="nav-link"
                :class="{ active: route.path === '/history' }"
                :aria-current="route.path === '/history' ? 'page' : undefined"
              >
                Histórico
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
