<script setup>
const isShowTags = ref(false);
const isMenuShown = ref(true);
const page = ref(1);
const pages = ref(0);
const tagList = ref([]);
const {params: {tag}} = useRoute();
const contentList = ref({})
const contentTags = ref([]);
const { data:contentArray, status:contentArrayStatus, refresh:refreshContentArray } = await useLazyAsyncData("contentArray",() => {
  return getContent((page.value - 1) * 5, 5)
})

onMounted(async () => {
  console.log(`params: ${tag}`)
  contentList.value = await queryContent("/notes/")
    .only(["tags"])
    .sort({ update: -1, $numeric: true })
    .find()
  tagList.value = getAllTags(contentList.value)
  contentTags.value = getTags(contentList.value)
  const pageLen = contentTags.value.filter(t => t == tag.trim()).length
  page.value = 1
  pages.value = Math.ceil(pageLen / 5)
});

async function getContent(start, move) {
  return await queryContent("/notes/")
    .where({tags : {$contains : [tag]}})
    .only(["title", "_path", "update", "tags"])
    .sort({ update: -1, $numeric: true })
    .skip(start)
    .limit(move)
    .find();
}

function getNextContent() {
  if (page.value == pages.value) return;
  page.value++;
  refreshContentArray();
}

function getPrevContent() {
  if (page.value == 1) return;
  page.value--;
  refreshContentArray();
}

function getAllTags(data) {
  const tagSet = new Set();
  let tagArr = [];
  data.forEach((el) => tagArr.push(el.tags));
  tagArr.forEach((tags) => {
    let t = tags.split(",");
    t.forEach((tag) => {
      if (tag.trim() !== "") {
        tagSet.add(tag.trim());
      }
    });
  });
  return Array.from(tagSet);
}

function getTags(data) {
  let tagArr = [];
  data.forEach((el) => tagArr.push(el.tags));
  let retArr = []
  tagArr.forEach((tags) => {
    let t = tags.split(",");
    t.forEach((tag) => {
      if (tag.trim() !== "") {
       retArr.push(tag.trim())
      }
    });
  });
  return retArr
}

function getTagsPost(post){
  let tags = post.split(",")
  return tags.map(e => e.trim())
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
        <p>showing: {{ tag }}</p>
        <NuxtLink to="/notes"> clear filter</NuxtLink>

        <Border></Border>
        <div v-if="contentArrayStatus == 'pending'">
          <p>loading ...</p>
        </div>

        <div v-else>
          <ul v-for="content in contentArray">
            <li>
              <NotePost>
                <template #title>
                  <NuxtLink :to="content._path">{{ content.title }}</NuxtLink>
                </template>
                <template #date>
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
                </template>
                <template #tags>
                  <div v-for="tag in getTagsPost(content.tags)">
                    <NuxtLink :to="`/notes/tags/${tag}`"> {{ tag }} </NuxtLink>
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
              <p class="page-num">{{ `${page} / ${pages}` }}</p>
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
          <NuxtLink :to="`/notes/tags/${tag}`">{{ tag }}</NuxtLink>
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
