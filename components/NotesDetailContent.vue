<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch, useSeoMeta } from '#app';
import { useNotionBlockParser } from '../composables/useNotionBlockParser';
import TagButton from '~/components/atoms/TagButton.vue';

const isShowToC = ref(false);
const isMenuShown = ref(true);
const route = useRoute();
const isToCEmpty = ref(true);
const tags = ref<string[]>([]);

const { params } = useRoute();
const { data: article, error } = await useFetch(`/api/article/${params.id}`);

useSeoMeta({
  title: () => article.value?.title || '',
  ogTitle: () => article.value?.title || '',
  twitterTitle: () => article.value?.title || '',
  description: () => article.value?.excerpt || '',
  ogDescription: () => article.value?.excerpt || '',
  twitterDescription: () => article.value?.excerpt || '',
});

defineProps(["imgSrc"]);

const { parse, getTableOfContents } = useNotionBlockParser();

const parsedHtml = computed(() => {
  if (!article.value || !article.value.blocks) {
    return '';
  }
  return parse(article.value.blocks);
});

const tocLinks = computed(() => {
  if (!article.value || !article.value.blocks) {
    return [];
  }
  return getTableOfContents(article.value.blocks);
});

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
  if (article.value) {
    tags.value = (article.value.tags || []).map((t: any) => t.name.trim());
    isToCEmpty.value = tocLinks.value.length === 0;
  }
  loadTwitterWidgets();
});

watch(parsedHtml, () => {
  nextTick(() => {
    loadTwitterWidgets();
  });
});

function closeModal() {
  if (isShowToC.value === true) {
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
      targetElement.scrollIntoView({ behavior: 'smooth' });
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
  <div @click="closeModal()" class="page">
    <div class="flex-vert center-">
      <div class="content-box">
        <div class="flex-vert center-">
          <NoteHeader v-if="article">
            <template #title>
              <h1>{{ article.title }}</h1>
            </template>
            <template #date>
              <p>
                作成日:
                {{
                  new Date(article.createdAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }).replace(/\//g, '.')
                }}
              </p>
            </template>
            <template #tags>
              <div v-for="tag in tags" :key="tag">
                <TagButton :name="tag" />
              </div>
            </template>
          </NoteHeader>
          <main class="flex-vert center-" v-if="article">
            <div class="article-box article" v-html="parsedHtml"></div>
          </main>
        </div>
      </div>
      <div class="bottom"></div>
    </div>
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
  </div>
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
