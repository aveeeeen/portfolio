<script setup>
const contentList = ref(null);
const contentArrary = ref(null);
const isUpdated = ref(false);
const page = ref(0);
const pages = ref(0);

onMounted(async () => {
  contentList.value = await queryContent("/")
    .only(["title", "_path", "update", "tags"])
    .sort({ update: -1, $numeric: true })
    .find();
  console.log(contentList.value);
  getContent(page.value, 5);
  pages.value = Math.floor(contentList.value.length / 5);
  console.log(pages.value);
});

async function getContent(start, move) {
  contentArrary.value = await queryContent("/")
    .only(["title", "_path", "update", "tags"])
    .sort({ update: -1, $numeric: true })
    .skip(start)
    .limit(move)
    .find();
  console.log(page.value);
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
</script>

<template>
  <div class="page center--">
    <div class="content-box">
      <h1>Notes</h1>
      <p>new → old</p>
      <hr />
      <ul v-for="content in contentArrary">
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
  </div>
  <div class="center--">
    <div class="page-selector">
      <div class="selector-flex center-">
        <a class="" @click="getPrevContent()">back</a>
        <p class=" page-num">{{ `${page + 1} / ${pages + 1}` }}</p>
        <a class="" @click="getNextContent()">next</a>
      </div>
    </div>
  </div>

  <div class="menu">
    <Menu></Menu>
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
  position: absolute;
  bottom: 5svh;
}

.page-selector div{
  margin: 5px;
}

button {
  width: 100px;
  background-color: gray;
  z-index: 3;
}

.selector-flex{
  display: flex;
  flex-direction: row;
  gap: 30px;
}

</style>
