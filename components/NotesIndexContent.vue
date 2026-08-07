<script setup lang="ts">
const isShowTags = ref(false);
const isMenuShown = ref(true);
const router = useRouter();
const route = useRoute();

const page = computed(() => route.query.page ? String(route.query.page) : "1");
const tags = computed(() => route.query.tags ? route.query.tags.toString().split(",").map(tag => `&tags=${tag}`).join("") : "");
const keyword = computed(() => route.query.keyword ? `&keyword=${route.query.keyword}` : "");
const queryparam = computed(() => `?page=${page.value}${tags.value}${keyword.value}`);

const [pagination, artilceList, tagList] = await Promise.all([
  useFetch(() => `/api/blog/pagination${queryparam.value}`, { method: "get" }),
  useFetch(() => `/api/blog/list-pages${queryparam.value}`, { method: "get" }),
  useFetch(() => `/api/blog/list-tags`, { method: "get" })
]);

if (artilceList.error) {
  console.error(artilceList.error.value)
}

if (artilceList.status.value === "error") {
  router.push("/notes")
}



function getNextContent() {
  if (Number(page.value) >= (pagination.data.value?.totalPages ?? 1)) return;
  router.push({
    path: '/notes',
    query: {
      ...route.query,
      page: Number(page.value) + 1
    }
  });
}

function getPrevContent() {
  if (Number(page.value) <= 1) return;
  router.push({
    path: '/notes',
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
  <div @click="closeModal()" class="page">
    <div class="center- flex-vert gap-20">
      <div class="content-box">
        <h1>Notes</h1>
        <Border></Border>
        <p>new → old</p>
        <div v-if='route.query["tags"]'>
          <p>showing: {{ route.query["tags"] }}</p>
          <NuxtLink to="/notes?page=1"> clear filter</NuxtLink>
        </div>
        <Border></Border>

        <div class="article-list">
          <ul v-for="content in artilceList.data.value">
            <li :key="content.id">
              <NotePost :id="content.id" :title="content.title" :tags="content.tags" :created-at="content.createdAt">
              </NotePost>
            </li>
          </ul>
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
  </div>

  <Nav :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
    <Menu></Menu>
    <div>
      <div @click.stop class="ui-box tags relative" v-if="isShowTags">
        <div class="tag-list" v-for="tag in tagList.data.value" :key="tag.name">
          <NuxtLink :to="`/notes?page=1&tags=${tag.name}`" @click="artilceList.refresh()"> {{ tag.name }}
          </NuxtLink>
        </div>
      </div>
      <div v-else class="ui-box relative">
        <a @click.stop="isShowTags = !isShowTags">Tags</a>
      </div>
    </div>
    <div v-if="isShowTags" class="ui-box">
      <a @click.stop="isShowTags = !isShowTags">Close</a>
    </div>
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

.page-selector {
  position: relative;
}

.page-selector div {
  margin: 5px;
}

button:hover {
  color: white;
  display: inline;
  background-color: blue;
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
  max-width: 700px;
  min-height: 80svh;
}
</style>
