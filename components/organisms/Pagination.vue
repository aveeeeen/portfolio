<script setup lang="ts">
interface Props {
  currentPage: number | string;
  totalPages?: number | string;
  disablePrev?: boolean;
  disableNext?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalPages: 1,
  disablePrev: false,
  disableNext: false,
});

const emit = defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
}>();
</script>

<template>
  <div class="center--">
    <div class="page-selector">
      <div class="selector-flex center-">
        <button type="button" :disabled="disablePrev || Number(currentPage) <= 1" @click="emit('prev')">
          back
        </button>
        <p class="page-num">{{ `${currentPage} / ${totalPages ?? 1}` }}</p>
        <button type="button" :disabled="disableNext || Number(currentPage) >= (Number(totalPages) || 1)"
          @click="emit('next')">
          next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-selector {
  position: relative;
  margin-top: 64px;
}

.selector-flex {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 30px;
}

button {
  font-family: Noto Sans JP, sans-serif;
  font-size: 1rem;
  display: inline;
  color: var(--text-color-a);
  text-decoration: none;
  background: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

button:hover:not(:disabled) {
  color: white;
  display: inline;
  background-color: #0014FE;
}

button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
