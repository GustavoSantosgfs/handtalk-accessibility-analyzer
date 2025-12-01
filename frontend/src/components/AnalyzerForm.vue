<script setup lang="ts">
import { ref } from 'vue';
import { useAnalysisStore } from '../stores/analysis';

const store = useAnalysisStore();
const url = ref('');

const handleSubmit = async () => {
  if (!url.value.trim()) return;

  let urlToAnalyze = url.value.trim();
  if (!urlToAnalyze.startsWith('http://') && !urlToAnalyze.startsWith('https://')) {
    urlToAnalyze = 'https://' + urlToAnalyze;
  }

  await store.analyze(urlToAnalyze);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="card shadow-sm" role="search" aria-label="Formulário de análise de URL">
    <div class="card-body">
      <label for="url-input" class="form-label fw-semibold">
        URL do Site
      </label>
      <div class="input-group">
        <input
          id="url-input"
          v-model="url"
          type="url"
          class="form-control form-control-lg"
          placeholder="https://exemplo.com.br"
          :disabled="store.isLoading"
          aria-describedby="url-hint"
          required
        />
        <button
          type="submit"
          class="btn btn-primary btn-lg"
          :disabled="store.isLoading || !url.trim()"
          :aria-busy="store.isLoading"
        >
          <span v-if="store.isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ store.isLoading ? 'Analisando...' : 'Analisar' }}
        </button>
      </div>
      <div id="url-hint" class="form-text">
        Digite a URL completa do site que deseja analisar em busca de problemas de acessibilidade.
      </div>
    </div>
  </form>
</template>
