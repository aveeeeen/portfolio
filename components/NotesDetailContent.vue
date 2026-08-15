<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch, useSeoMeta } from '#app';
import { useNotionBlockParser } from '../composables/useNotionBlockParser';
import TagButton from '~/components/atoms/TagButton.vue';
import NoteDetailSkelton from '~/components/NoteDetailSkelton.vue';

const isShowToC = ref(false);
const isMenuShown = ref(true);
const route = useRoute();
const articleId = computed(() => {
  const id = route.params.id;
  return id && id !== 'undefined' ? (Array.isArray(id) ? id[0] : id) : '';
});
const { data: article, status } = useFetch<any>(() => (articleId.value ? `/api/article/${articleId.value}` : ''));

useSeoMeta({
  title: () => article.value?.title || '',
  ogTitle: () => article.value?.title || '',
  description: () => article.value?.excerpt || '',
  ogDescription: () => article.value?.excerpt || '',
  ogUrl: () => `https://braveeeeen.com${route.fullPath}`,
});

defineProps(["imgSrc"]);

const { parse, getTableOfContents } = useNotionBlockParser();

const tags = computed(() => (article.value?.tags || []).map((t: any) => t.name.trim()));

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

const isToCEmpty = computed(() => tocLinks.value.length === 0);

import { useMermaid } from '../composables/useMermaid';

const { renderMermaid } = useMermaid();

const checkArticleImagesPortrait = () => {
  if (process.client) {
    const images = document.querySelectorAll<HTMLImageElement>('.article img');
    images.forEach(img => {
      if (img.complete && img.naturalWidth && img.naturalHeight) {
        if (img.naturalHeight > img.naturalWidth && img.naturalHeight > 600) {
          img.classList.add('portrait');
        }
      } else {
        img.addEventListener('load', () => {
          if (img.naturalHeight > img.naturalWidth && img.naturalHeight > 600) {
            img.classList.add('portrait');
          }
        }, { once: true });
      }
    });
  }
};

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
  renderMermaid();
  checkArticleImagesPortrait();
});

watch(parsedHtml, () => {
  nextTick(() => {
    loadTwitterWidgets();
    renderMermaid();
    checkArticleImagesPortrait();
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
  <NoteDetailSkelton v-if="status === 'pending'" />
  <template v-else>
    <div class="flex-vert center- width-guard" @click="closeModal">
      <div class="content-box flex-vert center-">
        <NoteHeader>
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
                  day: '2-digit',
                  timeZone: 'Asia/Tokyo'
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
          <ol class="root-table-ul">
            <li class="table-li toc-spacing" v-for="h1 of tocLinks" :key="h1.id">
              <a @click.prevent="scrollToId(h1.id)" :href="`#${h1.id}`">{{ h1.text }}</a>
              <ol v-if="h1.children && h1.children.length > 0" class="table-ul">
                <li class="table-li" v-for="h2 of h1.children" :key="h2.id">
                  <a @click.prevent="scrollToId(h2.id)" :href="`#${h2.id}`">{{ h2.text }}</a>
                  <ol v-if="h2.children && h2.children.length > 0" class="table-ul">
                    <li class="table-li" v-for="h3 of h2.children" :key="h3.id">
                      <a @click.prevent="scrollToId(h3.id)" :href="`#${h3.id}`">{{ h3.text }}</a>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>
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

<style scoped>
.toc {
  max-width: 300px;
  max-height: 250px;
  min-width: 100px;
  overflow-x: scroll;
}

.toc-spacing {
  padding: 8px 0;
  margin: 0;
}

.root-table-ul {
  padding-left: 12px;
  list-style: none;
  margin: 0;
}

.table-ul {
  padding-left: 24px;
  list-style: none;
}

.table-li {
  padding-top: 6px;
}

main {
  margin-top: 32px;
  margin-bottom: 32px;
  width: 100%;
  max-width: 800px;
}
</style>
