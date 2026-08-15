<template>
  <div class="tile">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.tile {
  padding: var(--space-s) var(--space-l);
  border-radius: var(--space-ms);
  border: solid 1px var(--text-color);
  width: 80%;
  box-sizing: border-box;
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  width: fit-content;
  max-width: 80svw;
}

:deep(h3) {
  margin: var(--space-s) 0;
  padding: 0;
}

:deep(p) {
  margin: 0;
}

:deep(a) {
  margin: 0;
  padding: 0;
}

@media (max-width: 800px) {
  .tile {
    padding: var(--space-l) var(--space-s);
    border-radius: var(--space-ms);
    border: solid 1px var(--text-color);
    width: 100%;
  }
}
</style>