<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch, useSeoMeta } from '#app';
import { useNotionBlockParser } from '../composables/useNotionBlockParser';
import type { EventBlocksResult, ListEventResult } from '~/server/service/event.service.types';
import EventDetailHeader from './organisms/EventDetailHeader.vue';
import EventDetailSkelton from './organisms/EventDetailSkelton.vue';
import { useDate } from '../composables/useDate';

const isShowToC = ref(false);
const isMenuShown = ref(true);
const route = useRoute();
const eventId = computed(() => {
  const id = route.params.id;
  return id && id !== 'undefined' ? (Array.isArray(id) ? id[0] : id) : '';
});
const data = await useLazyFetch<EventBlocksResult>(() => (eventId.value ? `/api/event/${eventId.value}` : ''));
const event = computed(() => data.data.value ?? undefined);

useSeoMeta({
  title: () => event.value?.title || '',
  ogTitle: () => event.value?.title || '',
  twitterTitle: () => event.value?.title || '',
  ogImage: () => event.value?.imageUrl || '',
  twitterImage: () => event.value?.imageUrl || '',
  description: () => event.value ? `bravenは、${event.value.title}に出演いたします。\n開催日：${useDate(event.value.date)}。\n会場：${event.value.venue}。` : '',
  ogDescription: () => event.value ? `bravenは、${event.value.title}に出演いたします。\n開催日：${useDate(event.value.date)}。\n会場：${event.value.venue}。` : '',
  twitterDescription: () => event.value ? `bravenは、${event.value.title}に出演いたします。\n開催日：${useDate(event.value.date)}。\n会場：${event.value.venue}。` : '',
  ogUrl: () => `https://braveeeeen.vercel.app${route.fullPath}`,
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

const isToCEmpty = computed(() => tocLinks.value.length === 0);

const loadTwitterWidgets = () => {
  if (process.client && parsedHtml.value?.includes('twitter-tweet')) {
    if ((window as any).twttr) {
      (window as any).twttr.widgets?.load();
    } else {
      const script = document.createElement('script');
      script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
      script.setAttribute('async', 'true');
      script.setAttribute('charset', 'utf-8');
      document.head.appendChild(script);
    }
  }
};

onMounted(() => {
  loadTwitterWidgets();
});

watch(parsedHtml, () => {
  nextTick(() => {
    loadTwitterWidgets();
  });
});

function closeModal() {
  if (isShowToC.value) {
    isShowToC.value = false;
  }
  if (isMenuShown.value) {
    isMenuShown.value = false;
  }
}

function scrollToId(id: string) {
  closeModal();
  if (process.client) {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      const headerOffset = 72;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      history.pushState(null, '', `#${id}`);
    }
  }
}

watch(isMenuShown, () => {
  if (!isMenuShown.value) {
    isShowToC.value = false;
  }
});
</script>

<template>
  <EventDetailSkelton v-if="!event" />
  <template v-else>
    <div class="flex-vert center- width-guard" @click="closeModal">
      <div class="content-box">
        <EventDetailHeader :title="event.title" :date="event.date" :venue="event.venue" :image-url="event.imageUrl" />
        <main>
          <div class="article-box article" v-html="parsedHtml"></div>
        </main>
      </div>
    </div>
    <div class="bottom"></div>
    <Footer></Footer>
    <Nav :close="isMenuShown" @isclose="(e) => isMenuShown = e">
      <Menu></Menu>
      <div v-if="!isToCEmpty">
        <div @click.stop class="ui-box toc relative" v-if="isShowToC">
          <ul class="table-ul" v-for="link of tocLinks" :key="link.id">
            <li class="table-li">
              <a @click.prevent="scrollToId(link.id)" :href="`#${link.id}`">{{ link.text }}</a>
              <ul v-if="link.children && link.children.length > 0" class="table-ul">
                <li class="table-li" v-for="child in link.children" :key="child.id">
                  <a @click.prevent="scrollToId(child.id)" :href="`#${child.id}`">{{ child.text }}</a>
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
</template>

<style>
.toc {
  max-width: 300px;
  max-height: 250px;
  min-width: 100px;
  overflow-x: scroll;
}

.table-ul {
  padding-left: 15px;
  list-style: none;
  margin: 0;
}

.table-li {
  padding-bottom: 5px;
}

main {
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
}
</style>
