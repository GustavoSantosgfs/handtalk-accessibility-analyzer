<script setup lang="ts">
import { onMounted } from 'vue';
import { useAnalysisStore } from '../stores/analysis';
import HistoryList from '../components/HistoryList.vue';
import Pagination from '../components/Pagination.vue';

const store = useAnalysisStore();

onMounted(() => {
  store.fetchHistory(1);
});

const handlePageChange = (page: number) => {
  store.fetchHistory(page);
};
</script>

<template>
  <main class="container py-5">
    <header class="text-center mb-5">
      <h1 class="display-5 fw-bold text-primary">Histórico de Análises</h1>
      <p class="text-muted">
        Visualize todas as análises de acessibilidade realizadas anteriormente.
      </p>
    </header>

    <div v-if="store.isLoading" class="text-center py-5" role="status" aria-live="polite">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="text-muted mt-2">Carregando histórico...</p>
    </div>

    <div v-else-if="store.error" class="alert alert-danger" role="alert" aria-live="assertive">
      <strong>Erro:</strong> {{ store.error }}
    </div>

    <template v-else>
      <section aria-labelledby="history-list-title">
        <h2 id="history-list-title" class="visually-hidden">Registros de Análises</h2>

        <div v-if="store.history.length === 0" class="text-center py-5 bg-light rounded">
          <p class="text-muted mb-3">Nenhuma análise encontrada. Comece analisando uma URL na página inicial.</p>
          <router-link to="/" class="btn btn-primary">Ir para o Analisador</router-link>
        </div>

        <HistoryList v-else :items="store.history" />
      </section>

      <Pagination
        v-if="store.pagination.totalPages > 1"
        :current-page="store.pagination.page"
        :total-pages="store.pagination.totalPages"
        :total="store.pagination.total"
        @page-change="handlePageChange"
      />
    </template>
  </main>
</template>
