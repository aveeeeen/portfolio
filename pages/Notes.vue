<script setup>
const contentList = ref(null);
const contentArrary = ref(null);
const contentFiltered = ref(null);
const isLoading = ref(true);
const isShowTags = ref(false);
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
  pages.value = Math.floor(contentList.value.length / 5);
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
  getContent(page.value * 5, 5)
}

function getPrevContent() {
  if (page.value == 0) return;
  page.value--;
  getContent(page.value * 5, 5)
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

watch(contentArrary,() => {if(contentArrary) isLoading.value = false})

watch(contentFiltered,() => {if(contentArrary) isLoading.value = false})
</script>

<template>
  <div class="page center-">
    <div>
      <div class="content-box article-list">
        <h1>Notes</h1>
        <p>new → old</p>
        <div v-if="selectedFilter != ''">
          <p>showing: {{ selectedFilter }}</p>
          <a @click="selectedFilter = ''"> clear filter</a>
        </div>

        <hr />
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
    </div>

    <div class="menu show-right flex-vert">
      <Menu></Menu>
      <div>
        <div class="ui-box tags relative" v-if="isShowTags">
          <div class="tag-list" v-for="tag in tagList">
            <a @click="selectedFilter = tag">{{ tag }}</a>
          </div>
        </div>
        <div v-else class="ui-box relative">
          <a @click="isShowTags = !isShowTags">Tags</a>
        </div>
      </div>
      <div v-if="isShowTags" class="ui-box">
        <a @click="isShowTags = !isShowTags">Close</a>
      </div>
    </div>
  </div>
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

.article-list{
  max-width: 800px;
  width: 80%;
  min-height: 80svh;
}
</style>
