<script setup lang="ts">
import { computed, onMounted, watch, nextTick } from 'vue';
import { useNotionBlockParser } from '~/composables/useNotionBlockParser';
import { useMermaid } from '~/composables/useMermaid';
import { testNotionBlocks } from '~/assets/fixtures/test-notion-blocks';

const { parse } = useNotionBlockParser();
const { renderMermaid } = useMermaid();

const parsedHtml = computed(() => {
  return parse(testNotionBlocks as any);
});

onMounted(() => {
  renderMermaid();
});

watch(parsedHtml, () => {
  nextTick(() => {
    renderMermaid();
  });
});
</script>

<template>
  <div class="flex-vert center- width-guard">
    <div class="content-box" style="padding: 40px 20px;">
      <main>
        <div class="article-box article" v-html="parsedHtml"></div>
      </main>
    </div>
  </div>
</template>

<style scoped>
main {
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
}
</style>
