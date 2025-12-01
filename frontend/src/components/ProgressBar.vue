<script setup lang="ts">
defineProps<{
  progress: number;
  message: string;
}>();
</script>

<template>
  <div class="card mt-3" role="status" aria-live="polite">
    <div class="card-body">
      <div class="progress" style="height: 10px;">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          :style="{ width: `${progress}%` }"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Analysis progress: ${progress}%`"
        ></div>
      </div>
      <p class="text-center text-muted small mt-2 mb-0">{{ message }}</p>
    </div>
  </div>
</template>
