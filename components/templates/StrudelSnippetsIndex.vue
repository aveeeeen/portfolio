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
    path: '/playground/strudel-snippets',
    query: {
      ...route.query,
      page: Number(page.value) + 1
    }
  });
}

function getPrevContent() {
  if (Number(page.value) <= 1) return;
  router.push({
    path: '/playground/strudel-snippets',
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
      <p>Java SciptのライブコーディングライブラリStrudelで作った断片的なスニペットを日記的に載せています。</p>
      <Border></Border>
      <p>new → old</p>
      <Border></Border>
      <div class="article-list">
        <template v-if="snippetsList.status.value === 'pending' || !snippetsList.data.value">
          <ul v-for="i in 10" :key="i">
            <li>
              <div class="snippet-item-skeleton">
                <Skeleton class="snippet-text-skeleton" />
                <Skeleton class="snippet-date-skeleton" />
              </div>
            </li>
          </ul>
        </template>
        <template v-else>
          <ul v-for="snippet in snippets" :key="snippet.id">
            <li>
              <StrudelSnippetsItem :path="route.fullPath" :id="snippet.id" :title="snippet.title" :date="snippet.date">
              </StrudelSnippetsItem>
            </li>
          </ul>
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
  min-height: 50svh;
}

.snippet-text-skeleton {
  width: 30%;
  height: 1rem;
  margin: 8px 0;
  border-radius: 6px;
}

.snippet-date-skeleton {
  width: 40%;
  height: 1rem;
  border-radius: 6px;
}

.snippet-item-skeleton {
  margin-top: 32px;
  padding: 0 10px;
  width: 100%;
}
</style>
