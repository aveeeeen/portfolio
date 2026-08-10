<script setup lang="ts">
import EventCard from './organisms/EventCard.vue';
import EvnetCardSkelton from './organisms/EvnetCardSkelton.vue';
import { type ListEventResult } from "../server/service/event.service.types"

const isShowTags = ref(false);
const isMenuShown = ref(true);
const router = useRouter();
const route = useRoute();

const page = computed(() => route.query.page ? String(route.query.page) : "1");
const tags = computed(() => route.query.tags ? route.query.tags.toString().split(",").map(tag => `&tags=${tag}`).join("") : "");
const keyword = computed(() => route.query.keyword ? `&keyword=${route.query.keyword}` : "");
const queryparam = computed(() => `?page=${page.value}${tags.value}${keyword.value}`);

const pagination = useLazyFetch(() => `/api/event/pagination`, { method: "get" });
const eventList = useLazyFetch<ListEventResult[]>(() => `/api/event/list-events${queryparam.value}`, { method: "get" });

const events = computed(() => eventList.data.value ?? [])

if (eventList.error) {
  console.error(eventList.error.value)
}

if (eventList.status.value === "error" && (route.query.page || route.query.tags || route.query.keyword)) {
  router.push("/events")
}

function getNextContent() {
  if (Number(page.value) >= (pagination.data.value?.totalPages ?? 1)) return;
  router.push({
    path: '/events',
    query: {
      ...route.query,
      page: Number(page.value) + 1
    }
  });
}

function getPrevContent() {
  if (Number(page.value) <= 1) return;
  router.push({
    path: '/events',
    query: {
      ...route.query,
      page: Number(page.value) - 1
    }
  });
}

function closeModal() {
  if (isShowTags.value) {
    isShowTags.value = false;
  }

  if (isMenuShown.value) {
    isMenuShown.value = false;
  }
}

watch(isMenuShown, () => {
  if (!isMenuShown.value) {
    isShowTags.value = false;
  }
});
</script>

<template>
  <div class="center- flex-vert" @click="isMenuShown = isMenuShown = isMenuShown ? !isMenuShown : isMenuShown">
    <div class="content-box">
      <h1>Events</h1>
      <Border></Border>
      <p>new → old</p>
      <Border></Border>

      <div class="flex-vert gap-20 article-list">
        <template v-if="eventList.status.value === 'pending' || !eventList.data.value">
          <EvnetCardSkelton v-for="i in 5" :key="i" />
        </template>
        <template v-else>
          <EventCard v-for="event in events" :key="event.id" :id="event.id" :title="event.title" :date="event.date"
            :image-url="event.imageUrl" :venue="event.venue">
          </EventCard>
        </template>
      </div>
      <div class="center--">
        <div class="page-selector">
          <div class="selector-flex center-">
            <button class="" @click="getPrevContent()">back</button>
            <p class="page-num">{{ `${page} / ${pagination.data.value?.totalPages}` }}</p>
            <button class="" @click="getNextContent()">next</button>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
  <Footer></Footer>
  <Nav :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
    <Menu></Menu>
  </Nav>
</template>

<style scoped>
button:hover {
  color: white;
  display: inline;
  background-color: #0014FE;
}

button {
  font-size: 1rem;
  display: inline;
  color: var(--text-color-a);
  text-decoration: none;
  background: none;
  background-color: transparent;
  border: none;
}


ul {
  padding-left: 20px;
  display: block;
}

h2 {
  text-decoration: none;
  font-size: 2rem;
}

.page-selector {
  position: relative;
}

.page-selector div {
  margin: 5px;
}

.selector-flex {
  display: flex;
  flex-direction: row;
  gap: 30px;
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
  min-height: 80svh;
}
</style>
