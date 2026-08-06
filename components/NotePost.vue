<script setup lang="ts">
import type { ListArticleResult } from '~/server/service/blog.service.types';

const props = defineProps<Omit<ListArticleResult, "updatedAt">>()
</script>

<template>
  <div class="note-box">
    <NuxtLink :to="`/notes/${props.id}`">{{ props.title }}</NuxtLink>
    <div class="flex-vert note-post">
      <div class="note-post-p">
        作成日:
        {{
          new Date(props.createdAt).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '.')
        }}
      </div>
      <div class="flex-hori gap-10 tags note-post-p">
        <p>Tags:</p>
        <div v-for="tag in props.tags" :key="tag.name">
          <NuxtLink :to="`/notes?page=1&tags=${tag.name}`"> {{ tag.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-box {
  padding: 0 10px;
  margin-top: 32px;
  /* background-color: color-mix(in srgb, gray 10%, white 20%) */
}

.note-post {
  padding: 0;
  margin-top: 16px;
  gap: 4px;
}

.tags a {
  border: 2px solid;
  padding: 2px 4px;
  border-radius: 10px;
  border-color: color-mix(in srgb, slateblue 60%, white 30%);
  font-size: 0.8rem;
}

p {
  line-height: 1.0;
  margin: 0 0;
}

.tags {
  flex-wrap: wrap;
  align-items: baseline
}
</style>