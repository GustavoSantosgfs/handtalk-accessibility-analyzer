<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  total: number;
}>();

const emit = defineEmits<{
  pageChange: [page: number];
}>();

const pages = computed(() => {
  const range: (number | string)[] = [];
  const delta = 2;

  for (let i = 1; i <= props.totalPages; i++) {
    if (
      i === 1 ||
      i === props.totalPages ||
      (i >= props.currentPage - delta && i <= props.currentPage + delta)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== '...') {
      range.push('...');
    }
  }

  return range;
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('pageChange', page);
  }
};
</script>

<template>
  <nav class="mt-4" aria-label="Navegação de paginação">
    <p class="text-center text-muted small mb-2">
      Página {{ currentPage }} de {{ totalPages }} ({{ total }} resultados no total)
    </p>

    <ul class="pagination justify-content-center flex-wrap">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button
          class="page-link"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          aria-label="Ir para página anterior"
        >
          &laquo; Anterior
        </button>
      </li>

      <li
        v-for="(page, index) in pages"
        :key="index"
        class="page-item"
        :class="{ active: page === currentPage, disabled: page === '...' }"
      >
        <span v-if="page === '...'" class="page-link">...</span>
        <button
          v-else
          class="page-link"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="goToPage(page as number)"
          :aria-label="`Ir para página ${page}`"
        >
          {{ page }}
        </button>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button
          class="page-link"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          aria-label="Ir para próxima página"
        >
          Próxima &raquo;
        </button>
      </li>
    </ul>
  </nav>
</template>
