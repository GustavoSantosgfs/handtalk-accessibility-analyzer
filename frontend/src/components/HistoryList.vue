<script setup lang="ts">
import type { AnalysisResponse } from '../types/analysis';

defineProps<{
  items: AnalysisResponse[];
}>();

const getScoreClass = (score: number): string => {
  if (score >= 80) return 'bg-success';
  if (score >= 50) return 'bg-warning';
  return 'bg-danger';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR');
};

const truncateUrl = (url: string, maxLength: number = 50): string => {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
};
</script>

<template>
  <div class="list-group">
    <div
      v-for="item in items"
      :key="item.id"
      class="list-group-item list-group-item-action"
    >
      <div class="row align-items-center">
        <div class="col-auto">
          <div
            class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            :class="getScoreClass(item.result.score)"
            style="width: 50px; height: 50px; font-size: 0.85rem;"
          >
            {{ item.result.score }}%
          </div>
        </div>
        <div class="col">
          <a
            :href="item.url"
            target="_blank"
            rel="noopener"
            class="text-decoration-none fw-semibold"
            :title="item.url"
          >
            {{ truncateUrl(item.url) }}
          </a>
          <div class="small text-muted">
            {{ formatDate(item.analyzedAt) }} • {{ item.duration }}ms •
            {{ item.result.passedChecks }}/{{ item.result.totalChecks }} verificações
          </div>
        </div>
        <div class="col-auto d-flex gap-1 flex-wrap">
          <span
            class="badge"
            :class="item.result.title.exists && !item.result.title.isEmpty ? 'bg-success' : 'bg-danger'"
          >
            Título
          </span>
          <span
            class="badge"
            :class="item.result.images.withoutAlt === 0 ? 'bg-success' : 'bg-danger'"
          >
            Imagens
          </span>
          <span
            class="badge"
            :class="item.result.inputs.withoutLabel === 0 ? 'bg-success' : 'bg-danger'"
          >
            Inputs
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
