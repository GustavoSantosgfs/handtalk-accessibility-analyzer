<script setup lang="ts">
import type { AnalysisResponse } from '../types/analysis';

defineProps<{
  analysis: AnalysisResponse;
}>();

const getScoreClass = (score: number): string => {
  if (score >= 80) return 'bg-success';
  if (score >= 50) return 'bg-warning';
  return 'bg-danger';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR');
};
</script>

<template>
  <article class="card shadow-sm">
    <div class="card-body">
      <div class="row align-items-center mb-4 pb-3 border-bottom">
        <div class="col-auto text-center">
          <div
            class="rounded-circle d-flex align-items-center justify-content-center text-white"
            :class="getScoreClass(analysis.result.score)"
            style="width: 100px; height: 100px;"
            role="img"
            :aria-label="`Pontuação de acessibilidade: ${analysis.result.score} por cento`"
          >
            <div>
              <span class="fs-2 fw-bold">{{ analysis.result.score }}</span>
              <span class="fs-6">%</span>
            </div>
          </div>
          <p class="text-muted small mt-2 mb-0">
            {{ analysis.result.passedChecks }}/{{ analysis.result.totalChecks }} verificações
          </p>
        </div>
        <div class="col">
          <p class="mb-1">
            <strong>URL:</strong>
            <a :href="analysis.url" target="_blank" rel="noopener" class="text-break">
              {{ analysis.url }}
            </a>
          </p>
          <p class="mb-1 text-muted small">
            <strong>Analisado em:</strong> {{ formatDate(analysis.analyzedAt) }}
          </p>
          <p class="mb-0 text-muted small">
            <strong>Duração:</strong> {{ analysis.duration }}ms
          </p>
        </div>
      </div>

      <h3 class="h5 mb-3">Verificações de Acessibilidade</h3>

      <div class="list-group">
        <!-- Title Check -->
        <div
          class="list-group-item"
          :class="analysis.result.title.exists && !analysis.result.title.isEmpty ? 'list-group-item-success' : 'list-group-item-danger'"
        >
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="fs-5" aria-hidden="true">
                {{ analysis.result.title.exists && !analysis.result.title.isEmpty ? '✓' : '✗' }}
              </span>
              <strong>Título da Página</strong>
            </div>
            <span
              class="badge"
              :class="analysis.result.title.exists && !analysis.result.title.isEmpty ? 'bg-success' : 'bg-danger'"
            >
              {{ analysis.result.title.exists && !analysis.result.title.isEmpty ? 'Aprovado' : 'Reprovado' }}
            </span>
          </div>
          <p class="mb-0 small" v-if="analysis.result.title.exists && analysis.result.title.content">
            Título: "{{ analysis.result.title.content }}"
          </p>
          <p class="mb-0 small text-danger" v-else-if="analysis.result.title.exists && analysis.result.title.isEmpty">
            Tag de título existe mas está vazia
          </p>
          <p class="mb-0 small text-danger" v-else>
            Nenhuma tag de título encontrada
          </p>
        </div>

        <!-- Images Check -->
        <div
          class="list-group-item"
          :class="analysis.result.images.withoutAlt === 0 ? 'list-group-item-success' : 'list-group-item-danger'"
        >
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="fs-5" aria-hidden="true">
                {{ analysis.result.images.withoutAlt === 0 ? '✓' : '✗' }}
              </span>
              <strong>Atributos Alt das Imagens</strong>
            </div>
            <span
              class="badge"
              :class="analysis.result.images.withoutAlt === 0 ? 'bg-success' : 'bg-danger'"
            >
              {{ analysis.result.images.withoutAlt === 0 ? 'Aprovado' : 'Reprovado' }}
            </span>
          </div>
          <p class="mb-1 small">
            {{ analysis.result.images.total }} imagens encontradas,
            {{ analysis.result.images.withoutAlt }} sem atributo alt
          </p>
          <ul v-if="analysis.result.images.missingAltImages.length > 0" class="small mb-0 ps-3">
            <li v-for="(img, index) in analysis.result.images.missingAltImages.slice(0, 5)" :key="index" class="text-break">
              {{ img }}
            </li>
            <li v-if="analysis.result.images.missingAltImages.length > 5">
              ... e mais {{ analysis.result.images.missingAltImages.length - 5 }}
            </li>
          </ul>
        </div>

        <!-- Inputs Check -->
        <div
          class="list-group-item"
          :class="analysis.result.inputs.withoutLabel === 0 ? 'list-group-item-success' : 'list-group-item-danger'"
        >
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center gap-2">
              <span class="fs-5" aria-hidden="true">
                {{ analysis.result.inputs.withoutLabel === 0 ? '✓' : '✗' }}
              </span>
              <strong>Labels dos Campos de Formulário</strong>
            </div>
            <span
              class="badge"
              :class="analysis.result.inputs.withoutLabel === 0 ? 'bg-success' : 'bg-danger'"
            >
              {{ analysis.result.inputs.withoutLabel === 0 ? 'Aprovado' : 'Reprovado' }}
            </span>
          </div>
          <p class="mb-1 small">
            {{ analysis.result.inputs.total }} campos encontrados,
            {{ analysis.result.inputs.withoutLabel }} sem labels associados
          </p>
          <ul v-if="analysis.result.inputs.inputsWithoutLabel.length > 0" class="small mb-0 ps-3">
            <li v-for="(input, index) in analysis.result.inputs.inputsWithoutLabel.slice(0, 5)" :key="index">
              {{ input }}
            </li>
            <li v-if="analysis.result.inputs.inputsWithoutLabel.length > 5">
              ... e mais {{ analysis.result.inputs.inputsWithoutLabel.length - 5 }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </article>
</template>
