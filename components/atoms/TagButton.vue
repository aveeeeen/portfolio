<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

const props = withDefaults(
  defineProps<{
    name?: string;
    to?: RouteLocationRaw;
  }>(),
  {
    name: '',
    to: undefined
  }
);

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const targetTo = computed(() => {
  if (props.to) return props.to;
  if (props.name) return `/notes?page=1&tags=${props.name}`;
  return '#';
});

function handleClick(e: MouseEvent) {
  emit('click', e);
}
</script>

<template>
  <NuxtLink :to="targetTo" class="tag-button" @click="handleClick">
    {{ props.name }}
  </NuxtLink>
</template>

<style scoped>
.tag-button {
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  border: 1.5px solid;
  padding: 0.4rem 0.4rem;
  border-radius: 8px;
  border-color: color-mix(in srgb, slateblue 60%, white 30%);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 400;
}

a {
  height: 0.8rem;
}
</style>
