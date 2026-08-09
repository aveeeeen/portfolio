<template>
  <div style="padding: 40px; max-width: 800px; margin: 0 auto; color: var(--text-color);">
    <h1>Google Maps Shortlink Verification Test</h1>

    <div style="margin: 20px 0;">
      <strong>Input Shortlink URL:</strong>
      <code style="display: block; padding: 10px; background: rgba(128,128,128,0.1); margin-top: 5px; word-break: break-all; border-radius: 4px;">
        {{ data?.testUrl }}
      </code>
    </div>

    <div style="margin: 20px 0;">
      <strong>Backend Resolution Result:</strong>
      <pre style="padding: 15px; background: #1e1e1e; color: #4ec9b0; border-radius: 6px; overflow-x: auto; font-size: 13px;">{{ JSON.stringify(data?.result, null, 2) }}</pre>
    </div>

    <div style="margin: 20px 0;" v-if="parsedHtml">
      <strong>Parsed Notion Block Iframe Render:</strong>
      <div v-html="parsedHtml" style="margin-top: 10px;"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/test-embed3?url=https://maps.app.goo.gl/qrHSk33iToWZJpX58');
const { renderBlock } = useNotionBlockParser();

const parsedHtml = computed(() => {
  if (!data.value?.result) return '';
  const fakeBlock = {
    type: 'bookmark',
    bookmark: {
      url: data.value.result.resolvedUrl || data.value.testUrl,
      caption: []
    },
    embedData: data.value.result
  };
  return renderBlock(fakeBlock as any);
});
</script>
