<script setup lang="ts">
import TagButton from '~/components/atoms/TagButton.vue';
import Pagination from '~/components/organisms/Pagination.vue';

const isShowTags = ref(false);
const isMenuShown = ref(false);
const router = useRouter();
const route = useRoute();

const page = computed(() => route.query.page ? String(route.query.page) : "1");
const tags = computed(() => route.query.tags ? route.query.tags.toString().split(",").map(tag => `&tags=${tag}`).join("") : "");
const keyword = computed(() => route.query.keyword ? `&keyword=${route.query.keyword}` : "");
const queryparam = computed(() => `?page=${page.value}${tags.value}${keyword.value}`);

const pagination = useFetch(() => `/api/blog/pagination${queryparam.value}`, { method: "get" });
const artilceList = useFetch(() => `/api/blog/list-pages${queryparam.value}`, { method: "get" });
const tagList = useFetch(() => `/api/blog/list-tags`, { method: "get" });

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
</script>

<template>
  <div class="center- flex-vert width-guard"
    @click="isMenuShown = isMenuShown ? !isMenuShown : isMenuShown">
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
        <template v-if="!artilceList.data.value">
          <ul v-for="i in 10" :key="i">
            <li>
              <NoteSkeleton></NoteSkeleton>
            </li>
          </ul>
        </template>
        <template v-else>
          <ul v-for="content in artilceList.data.value" :key="content.id">
            <li>
              <NotePost :id="content.id" :title="content.title" :tags="content.tags" :created-at="content.createdAt">
              </NotePost>
            </li>
          </ul>
        </template>
      </div>
      <Pagination
        :current-page="page"
        :total-pages="pagination.data.value?.totalPages"
        @prev="getPrevContent"
        @next="getNextContent"
      />
    </div>
    <div class="bottom"></div>
  </div>
  <Footer></Footer>
  <Nav :close="isMenuShown" @isclose="(e) => isMenuShown = e">
    <Menu></Menu>
    <div>
      <div @click.stop class="ui-box tags flex-vert gap-10" v-if="isShowTags || tagList.data.value">
        <div class="tag-list" v-for="tag in tagList.data.value" :key="tag.name">
          <TagButton :name="tag.name" @click="artilceList.refresh()" />
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

.tags {
  width: fit-content;
  padding: 10px;
  max-height: 250px;
  min-width: 100px;
  overflow-x: scroll;
  flex-wrap: nowrap;
}

.tag-list {
  list-style: none;
}

.article-list {
  max-width: 800px;
  min-height: 80svh;
}
</style>
