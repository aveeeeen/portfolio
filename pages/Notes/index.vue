<script setup lang="ts">
import NoteSkelton from '../../components/NoteSkelton.vue';
const isShowTags = ref(false);
const isMenuShown = ref(true);
const router = useRouter();
const route = useRoute();

const page = computed(() => route.query.page ? String(route.query.page) : "1");
const tags = computed(() => route.query.tags ? route.query.tags.toString().split(",").map(tag => `&tags=${tag}`).join("") : "");
const keyword = computed(() => route.query.keyword ? `&keyword=${route.query.keyword}` : "");
const queryparam = computed(() => `?page=${page.value}${tags.value}${keyword.value}`);
console.log(queryparam.value);

const pagination = await useFetch(() => `/api/blog/pagination${queryparam.value}`, { method: "get" })
const artilceList = await useFetch(() => `/api/blog/list-pages${queryparam.value}`, { method: "get" })
const tagList = await useFetch(() => `/api/blog/list-tags`, { method: "get" })


if (artilceList.error) {
  console.log(artilceList.error.value)
}

if (artilceList.status.value === "error") {
  router.push("/notes")
}


useSeoMeta({
  title: "braveeeeen",
  ogTitle: "protfolio site of braven",
  description: "Published Notes and Blog",
  ogDescription: "Published Notes and Blog",
  ogUrl: "https://braveeeeen.vercel.app/notes",
  ogImage:
    "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
  twitterCard: "summary_large_image",
  twitterImage:
    "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
});



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
    <div class="center- flex-vert gap-10">
      <div class="content-box article-list">
        <h1>Notes</h1>
        <Border></Border>
        <p>new → old</p>
        <div v-if='route.query["tags"]'>
          <p>showing: {{ route.query["tags"] }}</p>
          <NuxtLink to="/notes?page=1"> clear filter</NuxtLink>
        </div>
        <Border></Border>
        <div v-if="artilceList.status.value === 'pending'">
          <!-- <div v-if="testLoading"> -->
          <ul v-for="i in 5">
            <li>
              <NoteSkelton></NoteSkelton>
            </li>
          </ul>
        </div>

        <div v-else>
          <ul v-for="content in artilceList.data.value">
            <li>
              <NotePost>
                <template #title>
                  <NuxtLink :to="`/notes/${content.id}`">{{ content.title }}</NuxtLink>
                </template>
                <template #date>
                  <p>
                    作成日:
                    {{
                      new Date(content.createdAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).replace(/\//g, '.')
                    }}
                  </p>
                </template>
                <template #tags>
                  <div v-for="tag in content.tags">
                    <NuxtLink :to="`/notes?page=1&tags=${tag.name}`" @click="artilceList.refresh()"> {{ tag.name }}
                    </NuxtLink>
                  </div>
                </template>
              </NotePost>
            </li>
          </ul>
        </div>
        <div class="center--">
          <div class="page-selector">
            <div class="selector-flex center-">
              <a class="" @click="getPrevContent()">back</a>
              <p class="page-num">{{ `${page} / ${pagination.data.value?.totalPages}` }}</p>
              <a class="" @click="getNextContent()">next</a>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom"></div>
    </div>
  </div>

  <Nav @click.stop="isMenuShown = !isMenuShown" :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
    <Menu></Menu>
    <div>
      <div @click.stop class="ui-box tags relative" v-if="isShowTags">
        <div class="tag-list" v-for="tag in tagList.data.value">
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

button {
  width: 100px;
  background-color: gray;
  z-index: 3;
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
