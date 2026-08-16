<script setup lang="ts">
import EventCard from '~/components/organisms/EventCard.vue';
import EventCardSkeleton from '~/components/organisms/EventCardSkeleton.vue';
import Pagination from '~/components/organisms/Pagination.vue';
import { type ListEventResult } from "~/server/service/event.service.types";
import type { ListStrudelSnippetsResult } from '~/server/service/strudel-snippets.service.types';
import StrudelSnippetsItem from '../organisms/StrudelSnippetsItem.vue';

const isMenuShown = ref(true);
const router = useRouter();
const route = useRoute();

const page = computed(() => route.query.page ? String(route.query.page) : "1");
const queryparam = computed(() => `?page=${page.value}`);

const pagination = useFetch(() => `/api/strudel-snippets/pagination`, { method: "get" });
const snippetsList = useFetch<ListStrudelSnippetsResult[]>(() => `/api/strudel-snippets/list-strudel-snippets${queryparam.value}`, { method: "get" });

const snippets = computed(() => snippetsList.data.value ?? []);

watch(() => snippetsList.error.value, (err) => {
  if (err) {
    console.error(err);
  }
});

watch(() => snippetsList.status.value, (status) => {
  if (status === "error" && (route.query.page)) {
    router.push("/");
  }
});

function getNextContent() {
  if (Number(page.value) >= (pagination.data.value?.totalPages ?? 1)) return;
  router.push({
    path: '/strudel-snippets',
    query: {
      ...route.query,
      page: Number(page.value) + 1
    }
  });
}

function getPrevContent() {
  if (Number(page.value) <= 1) return;
  router.push({
    path: '/strudel-snippets',
    query: {
      ...route.query,
      page: Number(page.value) - 1
    }
  });
}

</script>

<template>
  <div class="center- flex-vert width-guard" @click="isMenuShown = isMenuShown ? !isMenuShown : isMenuShown">
    <div class="content-box">
      <h1>Strudel Snippets</h1>
      <Border></Border>
      <p>new → old</p>
      <Border></Border>

      <div class="flex-vert gap-20 article-list">
        <template v-if="snippetsList.status.value === 'pending' || !snippetsList.data.value">
          <Skeleton class="snippetItemSkeleton" v-for="i in 5" :key="i" />
        </template>
        <template v-else>
          <StrudelSnippetsItem v-for="snippet in snippets" :key="snippet.id" :id="snippet.id" :title="snippet.title"
            :date="snippet.date">
          </StrudelSnippetsItem>
        </template>
      </div>
      <Pagination :current-page="page" :total-pages="pagination.data.value?.totalPages" @prev="getPrevContent"
        @next="getNextContent" />
    </div>
    <div class="bottom"></div>
  </div>
  <Footer></Footer>
  <Nav :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
    <Menu></Menu>
  </Nav>
</template>

<style scoped>
ul {
  padding-left: 20px;
  display: block;
}

h2 {
  text-decoration: none;
  font-size: 2rem;
}

.tags {
  max-width: 300px;
  max-height: 250px;
  min-width: 100px;
  overflow-x: scroll;
}

.tag-list {
  list-style: none;
}

.article-list {
  max-width: 800px;
  min-height: 60svh;
}

.snippetItemSkeleton {
  width: 100%;
  height: 86px;
}
</style>
