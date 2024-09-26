<script setup>
const contentList = ref(null);
const contentArrary = ref(null);
const contentFiltered = ref(null);
const isLoading = ref(true);
const isShowTags = ref(false);
const isMenuShown = ref(true);
const page = ref(0);
const pages = ref(0);
const tagList = ref([]);
const selectedFilter = ref("");

onMounted(async () => {
  contentList.value = await queryContent("/")
    .only(["title", "_path", "update", "tags"])
    .sort({ update: -1, $numeric: true })
    .find();
  getContent(page.value, 5);
  pages.value =
    contentList.value.length % 5 == 0
      ? Math.floor(contentList.value.length / 5) - 1
      : Math.floor(contentList.value.length / 5);
  console.log(contentList.value.length);
  getAllTags();
});

async function getContent(start, move) {
  isLoading.value = true;
  contentArrary.value = await queryContent("/")
    .only(["title", "_path", "update", "tags"])
    .sort({ update: -1, $numeric: true })
    .skip(start)
    .limit(move)
    .find();
}

function getNextContent() {
  if (page.value == pages.value) return;
  page.value++;
  getContent(page.value * 5, 5);
}

function getPrevContent() {
  if (page.value == 0) return;
  page.value--;
  getContent(page.value * 5, 5);
}

function getAllTags() {
  const tagSet = new Set();
  let tagArr = [];
  contentList.value.forEach((el) => tagArr.push(el.tags));
  tagArr.forEach((tags) => {
    let t = tags.split(",");
    t.forEach((tag) => {
      if (tag.trim() !== "") {
        tagSet.add(tag.trim());
      }
    });
  });
  tagList.value = Array.from(tagSet);
}

async function filterByTags(tag) {
  isLoading.value = true;
  contentFiltered.value = await queryContent("/")
    .where({ tags: { $containsAny: [tag] } })
    .only(["title", "_path", "update", "tags"])
    .sort({ update: -1, $numeric: true })
    .find();
  console.log(contentFiltered.value);
  isLoading.value = false;
}

watch(selectedFilter, async () => {
  if (selectedFilter != "") {
    filterByTags(selectedFilter.value);
    isShowTags.value = false;
  } else {
    getContent(page.value, 5);
  }
  console.log(selectedFilter.value);
  console.log(contentFiltered.value);
});

function closeModal() {
  if (isShowTags.value) {
    isShowTags.value = false;
  }

  if (isMenuShown.value) {
    isMenuShown.value = false;
  }
}

function selectFilter(tag) {
  selectedFilter.value = tag;
  closeModal();
}

watch(contentArrary, () => {
  if (contentArrary) isLoading.value = false;
});

watch(contentFiltered, () => {
  if (contentArrary) isLoading.value = false;
});

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
        <div v-if="selectedFilter != ''">
          <p>showing: {{ selectedFilter }}</p>
          <a @click="selectedFilter = ''"> clear filter</a>
        </div>

        <Border></Border>
        <div v-if="isLoading">
          <p>loading ...</p>
        </div>

        <div v-else>
          <ul v-if="selectedFilter == ''" v-for="content in contentArrary">
            <li>
              <NuxtLink :to="content._path">{{ content.title }}</NuxtLink>
              <p>
                更新日:
                {{
                  content.update.toString().slice(0, 4) +
                  "." +
                  content.update.toString().slice(4, 6) +
                  "." +
                  content.update.toString().slice(6, 8)
                }}
              </p>
            </li>
          </ul>

          <ul v-else v-for="content in contentFiltered">
            <li>
              <NuxtLink :to="content._path">{{ content.title }}</NuxtLink>
              <p>
                更新日:
                {{
                  content.update.toString().slice(0, 4) +
                  "." +
                  content.update.toString().slice(4, 6) +
                  "." +
                  content.update.toString().slice(6, 8)
                }}
              </p>
            </li>
          </ul>
        </div>
        <div v-if="selectedFilter == ''" class="center--">
          <div class="page-selector">
            <div class="selector-flex center-">
              <a class="" @click="getPrevContent()">back</a>
              <p class="page-num">{{ `${page + 1} / ${pages + 1}` }}</p>
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
        <div class="tag-list" v-for="tag in tagList">
          <a @click.stop="selectFilter(tag)">{{ tag }}</a>
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
  max-width: 800px;
  min-height: 80svh;
}
</style>
