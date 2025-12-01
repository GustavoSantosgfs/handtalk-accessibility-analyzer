<script setup lang="ts">
import AnalyzerForm from '../components/AnalyzerForm.vue';
import ResultsDisplay from '../components/ResultsDisplay.vue';
import ProgressBar from '../components/ProgressBar.vue';
import { useAnalysisStore } from '../stores/analysis';

const store = useAnalysisStore();
</script>

<template>
  <main class="container py-5">
    <section class="text-center mb-5" aria-labelledby="hero-title">
      <h1 id="hero-title" class="display-4 fw-bold text-primary">Analisador de Acessibilidade Web</h1>
      <p class="lead text-muted mx-auto" style="max-width: 600px;">
        Analise qualquer site em busca de problemas básicos de acessibilidade. Verifique tags de título,
        atributos alt em imagens e associações de labels com inputs.
      </p>
    </section>

    <section class="mb-4" aria-labelledby="analyzer-title">
      <h2 id="analyzer-title" class="visually-hidden">Analisador de URL</h2>
      <AnalyzerForm />

      <ProgressBar
        v-if="store.progress"
        :progress="store.progress.progress"
        :message="store.progress.message"
      />

      <div v-if="store.error" class="alert alert-danger mt-3" role="alert" aria-live="assertive">
        <strong>Erro:</strong> {{ store.error }}
      </div>
    </section>

    <section v-if="store.hasResult" class="mt-5" aria-labelledby="results-title">
      <h2 id="results-title" class="h4 mb-3">Resultado da Análise</h2>
      <ResultsDisplay :analysis="store.currentAnalysis!" />
    </section>
  </main>
</template>
