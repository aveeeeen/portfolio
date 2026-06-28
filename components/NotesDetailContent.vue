<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch, useSeoMeta } from '#app';
import { useNotionBlockParser } from '../composables/useNotionBlockParser';

const isShowToC = ref(false);
const isMenuShown = ref(true);
const route = useRoute();
const isToCEmpty = ref(true);
const tags = ref<string[]>([]);

const { params } = useRoute();
const { data: article, error } = await useFetch(`/api/article/${params.id}`);

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

onMounted(() => {
  if (article.value) {
    tags.value = (article.value.tags || []).map((t: any) => t.name.trim());
    isToCEmpty.value = tocLinks.value.length === 0;

    useSeoMeta({
      title: `${article.value.title}`,
      ogTitle: `${article.value.title}`,
      description: `${article.value.title}`,
      ogDescription: `${article.value.title}`,
      ogUrl: `https://braveeeeen.vercel.app${route.path}`,
      ogImage:
        "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
      twitterCard: "summary_large_image",
      twitterImage:
        "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
    });
  }
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
      <div v-if="article">
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
                  day: '2-digit'
                }).replace(/\//g, '.')
              }}
            </p>
          </template>
          <template #tags>
            <div v-for="tag in tags" :key="tag">
              <NuxtLink :to="`/notes?page=1&tags=${tag}`"> {{ tag }} </NuxtLink>
            </div>
          </template>
        </NoteHeader>
        <main>
          <div class="article-box article" v-html="parsedHtml"></div>
        </main>
      </div>
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

.article-box {
  display: block;
  background-color: var(--bg-color);
  padding: 20px;
  max-width: 700px;
  margin: 30px;
  overflow-x: hidden;
  min-width: 50%;
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
  .article-box {
    display: block;
    background-color: var(--bg-color);
    margin: 20px;
    padding: 10px;
    overflow-x: hidden;
    min-width: 80%;
  }
}
</style>
