import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AnalysisResponse, AnalysisProgress, PaginatedResponse } from '../types/analysis';
import { analyzeUrl, getHistory } from '../services/api';
import socketService from '../services/socket';

export const useAnalysisStore = defineStore('analysis', () => {
  const currentAnalysis = ref<AnalysisResponse | null>(null);
  const history = ref<AnalysisResponse[]>([]);
  const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const progress = ref<AnalysisProgress | null>(null);

  const hasResult = computed(() => currentAnalysis.value !== null);
  const scoreColor = computed(() => {
    if (!currentAnalysis.value) return 'gray';
    const score = currentAnalysis.value.result.score;
    if (score >= 80) return 'green';
    if (score >= 50) return 'yellow';
    return 'red';
  });

  async function analyze(url: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    progress.value = null;
    currentAnalysis.value = null;

    try {
      socketService.connect();
      socketService.onProgress((p) => {
        progress.value = p;
      });

      const socketId = socketService.getSocketId();
      const result = await analyzeUrl(url, socketId);
      currentAnalysis.value = result;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'An unexpected error occurred';
      }
    } finally {
      isLoading.value = false;
      progress.value = null;
    }
  }

  async function fetchHistory(page: number = 1, limit?: number): Promise<void> {
    isLoading.value = true;
    error.value = null;

    const itemsPerPage = limit ?? pagination.value.limit;

    try {
      const result: PaginatedResponse<AnalysisResponse> = await getHistory(page, itemsPerPage);
      history.value = result.data;
      pagination.value = {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      };
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Failed to load history';
      }
    } finally {
      isLoading.value = false;
    }
  }

  function setItemsPerPage(limit: number): void {
    pagination.value.limit = limit;
    fetchHistory(1, limit);
  }

  function clearResult(): void {
    currentAnalysis.value = null;
    error.value = null;
    progress.value = null;
  }

  return {
    currentAnalysis,
    history,
    pagination,
    isLoading,
    error,
    progress,
    hasResult,
    scoreColor,
    analyze,
    fetchHistory,
    setItemsPerPage,
    clearResult
  };
});
