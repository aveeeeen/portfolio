<script setup lang="ts">
import type { ListArticleResult } from '~/server/service/blog.service.types';
import TagButton from '~/components/atoms/TagButton.vue';

const props = defineProps<Omit<ListArticleResult, "updatedAt">>()
</script>

<template>
  <div class="note-box">
    <NuxtLink :to="`/notes/${props.id}`">{{ props.title }}</NuxtLink>
    <div class="flex-vert note-post">
      <p class="note-post-p">
        作成日:
        {{
          new Date(props.createdAt).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Tokyo'
          }).replace(/\//g, '.')
        }}
      </p>
      <div class="flex-hori gap-10 tags">
        <p>Tags:</p>
        <div v-for="tag in props.tags" :key="tag.name">
          <TagButton :name="tag.name" />
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
  margin-top: var(--space-s);
  gap: var(--space-ms);
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