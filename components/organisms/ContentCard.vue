<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
  path: string;
}>()
</script>

<template>
  <NuxtLink :to="path" class="tile-anchor">
    <div class="tile">
      <div class="content">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
        <span>{{ path }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.tile-anchor {
  display: block;
  width: auto;
  height: fit-content
}

p {
  font-size: 0.95rem;
}

a {
  font-size: 0.95rem;
}

.tile {
  padding: var(--space-m) var(--space-l);
  border-left: solid 2px var(--text-color);
  box-sizing: border-box;
  width: 90%;
}

.tile-anchor:hover {
  background-color: transparent;
}

.tile-anchor:hover .tile {
  background-color: color-mix(#00f 10%, var(--bg-color) 100%);
}

.tile-anchor:hover span {
  color: #fff;
  background-color: #00f;
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  width: fit-content;
  max-width: 80svw;
}

h3 {
  font-size: 1.5rem;
  margin-top: 0px;
  line-height: 1.0;
  padding: 0;
  width: fit-content;
}

p {
  margin: 0;
  width: fit-content;
}

span {
  margin: 0;
  padding: 0;
  width: fit-content;
}

@media (max-width: 800px) {
  .tile {
    padding: var(--space-s) var(--space-m);
    width: 100%;
  }
}
</style>
