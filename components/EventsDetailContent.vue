<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch, useSeoMeta } from '#app';
import { useNotionBlockParser } from '../composables/useNotionBlockParser';
import type { EventBlocksResult, ListEventResult } from '~/server/service/event.service.types';
import EventDetailHeader from './organisms/EventDetailHeader.vue';

const isShowToC = ref(false);
const isMenuShown = ref(true);
const route = useRoute();
const isToCEmpty = ref(true);
const tags = ref<string[]>([]);

const { params } = useRoute();
const data = await useFetch<EventBlocksResult>(`/api/event/${params.id}`);
const event = computed(() => data.data.value ?? undefined);

useSeoMeta({
  title: () => event.value?.title || '',
  ogTitle: () => event.value?.title || '',
  twitterTitle: () => event.value?.title || '',
  ogImage: () => event.value?.imageUrl || '',
  twitterImage: () => event.value?.imageUrl || '',
  description: () => `${event.value?.title}\n開催日：${event.value?.date}\n会場：${event.value?.venue} ` || '',
  ogDescription: () => `${event.value?.title}\n開催日：${event.value?.date}\n会場：${event.value?.venue} ` || '',
  twitterDescription: () => `${event.value?.title}\n開催日：${event.value?.date}\n会場：${event.value?.venue} ` || '',
});

const { parse, getTableOfContents } = useNotionBlockParser();

const parsedHtml = computed(() => {
  if (!event.value || !event.value.blocks) {
    return '';
  }
  return parse(event.value.blocks);
});

const tocLinks = computed(() => {
  if (!event.value || !event.value.blocks) {
    return [];
  }
  return getTableOfContents(event.value.blocks);
});

function closeModal() {
  if (isShowToC.value === true) {
    isShowToC.value = false;
  }
  if (isMenuShown.value) {
    isMenuShown.value = false;
  }
}

watch(isMenuShown, () => {
  if (!isMenuShown.value) {
    isShowToC.value = false;
  }
});
</script>

<template>
  <div @click="closeModal()" class="page">
    <div class="flex-vert center-">
      <EventDetailHeader
        v-if="event"
        :title="event.title"
        :date="event.date"
        :venue="event.venue"
        :image-url="event.imageUrl"
      />
      <main class="flex-vert center-" v-if="event">
        <div class="event-box event" v-html="parsedHtml"></div>
      </main>
    </div>
  </div>

  <Nav @click.stop="isMenuShown = !isMenuShown" :close="isMenuShown" @isclose="(e) => isMenuShown = e">
    <Menu></Menu>
    <div v-if="!isToCEmpty">
      <div @click.stop class="ui-box toc relative" v-if="isShowToC">
        <ul class="table-ul" v-for="link of tocLinks" :key="link.id">
          <li class="table-li">
            <a @click="closeModal()" :href="`#${link.id}`">{{ link.text }}</a>
            <ul v-if="link.children && link.children.length > 0" class="table-ul">
              <li class="table-li" v-for="child in link.children" :key="child.id">
                <a @click="closeModal()" :href="`#${child.id}`">{{ child.text }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-else class="ui-box relative">
        <a @click.stop="isShowToC = !isShowToC">Table of Contents</a>
      </div>
    </div>
    <div v-if="isShowToC" class="ui-box">
      <a @click.stop="isShowToC = !isShowToC">Close</a>
    </div>
  </Nav>
</template>

<style>
.toc {
  max-width: 300px;
  max-height: 250px;
  min-width: 100px;
  overflow-x: scroll;
}

h2>a {
  font-size: 1.5rem;
}

h3>a {
  font-size: 1.25rem;
}

.table-ul {
  padding-left: 15px;
  list-style: none;
  margin: 0;
}

.table-li {
  padding-bottom: 5px;
}

.event-box {
  display: block;
  background-color: var(--bg-color);
  padding: 20px;
  max-width: 700px;
  overflow-x: hidden;
  width: 90%;
}

main {
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
}

.shiki {
  overflow-x: auto;
  padding: 20px;
  border: 1px black solid;
  border-radius: 10px;
}

blockquote {
  border-left: 3px solid black;
  padding-left: 1rem;
  margin: 1rem;
}

@media (max-width: 800px) {
  .event-box {
    display: block;
    background-color: var(--bg-color);
    padding: 10px;
    overflow-x: hidden;
    width: 90%;
  }
}
</style>
