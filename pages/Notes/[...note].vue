<script setup>
const isShowToC = ref(false);
const isMenuShown = ref(true);
const route = useRoute();
const isToCEmpty = ref(true);
const tags = ref([])
let contentQuery = null;

defineProps(["imgSrc"]);

onMounted(async () => {
  contentQuery = await queryContent(route.fullPath).findOne();
  console.log(contentQuery)
  tags.value = contentQuery.tags.split(",")
  tags.value = tags.value.map(e => e.trim())
  console.log(tags.value)
  isToCEmpty.value = contentQuery.body.toc.links.length == 0 ? true : false;
});


function closeModal() {
  if (isShowToC.value == true) {
    isShowToC.value = false;
  }
  if (isMenuShown.value) {
    isMenuShown.value = false;
  }
}

watch(isMenuShown, () => {
  if (!isMenuShown.value) {
    isShowToC.value = false;
  }
})
</script>

<template>
  <div @click="closeModal()" class="page">
    <div class="flex-vert center-">
      <div>
        <ContentDoc v-slot="{ doc }">
          <NoteHeader>
            <template #title>
              <h1>{{ doc.title }}</h1>
            </template>
            <template #date>
              <p>
                更新日:
                {{
                  doc.update.toString().slice(0, 4) +
                  "." +
                  doc.update.toString().slice(4, 6) +
                  "." +
                  doc.update.toString().slice(6, 8)
                }}
              </p>
            </template>
            <template #tags>
              <div v-for="tag in tags">
                <NuxtLink :to="`/notes/tags/${tag}`"> {{ tag }} </NuxtLink>
              </div>
            </template>
          </NoteHeader>
        </ContentDoc>
        <main>
          <ContentDoc v-slot="{ doc }">
            <!-- Post title -->

            <!-- Table of contents -->

            <!-- Main post content -->
            <!-- imageSize: 'style' -->

            <ContentRenderer class="article-box article" :value="doc" />
          </ContentDoc>
        </main>
      </div>
    </div>
  </div>

  <Nav @click.stop="isMenuShown = !isMenuShown" :close="isMenuShown" @isclose="(e) => isMenuShown = e">
    <Menu></Menu>
    <div v-if="!isToCEmpty">
      <div @click.stop class="ui-box toc relative" v-if="isShowToC">
        <ContentDoc v-slot="{ doc }">
          <ul class="table-ul" v-for="link of doc.body.toc.links" :key="link.id">
            <li class="table-li">
              <a @click="closeModal()" :href="`#${link.id}`">{{
                link.text
              }}</a>
              <ul v-if="link.children" class="table-ul">
                <li class="table-li" v-for="children in link.children">
                  <a @click="closeModal()" :href="`#${children.id}`">{{ children.text }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </ContentDoc>
      </div>
      <div v-else class="ui-box relative">
        <a @click.stop="isShowToC = !isShowToC">Table of Contents</a>
      </div>
    </div>
    <div v-if="isShowToC" class="ui-box">
      <a @click.stop="isShowToC = !isShowToC">Close</a>
    </div>
  </Nav>
</template>

<style scoped>
.toc {
  max-width: 300px;
  max-height: 250px;
  min-width: 100px;
  overflow-x: scroll;
}

h3 a {
  font-size: 1.25rem;
}

.table-ul {
  padding-left: 15px;
  list-style: none;
  margin: 0;
}

.table-li {
  padding-bottom: 5px;
}

.article-box {
  display: block;
  background-color: var(--bg-color);
  padding: 20px;
  max-width: 700px;
  margin: 30px;
  overflow-x: hidden;
  word-break: break-all;
  min-width: 50%;
}

@media (max-width: 800px) {
  .article-box {
    display: block;
    background-color: var(--bg-color);
    margin: 20px;
    padding: 10px;
    overflow-x: hidden;
    min-width: 80%;
  }
}
</style>
