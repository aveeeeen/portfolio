<script setup>
const isShowToC = ref(false);
const isMenuShown = ref(true);
const route = useRoute();
const isToCEmpty = ref(true);
let contentQuery = null;

defineProps(["imgSrc"]);
watch(isShowToC);

onBeforeMount(() => {
  let bgC = getComputedStyle(document.body).getPropertyValue("--bg-color");
  let html = document.querySelector("html");
  html.style.backgroundColor = bgC;
});

onMounted(async () => {
  contentQuery = await queryContent(route.fullPath).findOne();
  isToCEmpty.value = contentQuery.body.toc.links.length == 0 ? true : false;
  console.log(contentQuery.body.toc);
});

onUnmounted(() => {
  let html = document.querySelector("html");
  let contetnBox = document.querySelector("content-box");
  html.style.backgroundColor = "blue";
});

function closeModal() {
  if (isShowToC.value == true) {
    isShowToC.value = false;
  }
  if (isMenuShown.value){
    isMenuShown.value = false;
  }
}
</script>

<template>
  <div @click="closeModal()" class="page center--">
    <div>
      <main>
        <ContentDoc v-slot="{ doc }">
          <!-- Post title -->

          <!-- Table of contents -->

          <!-- Main post content -->
          <!-- imageSize: 'style' -->

          <ContentRenderer class="content-box article" :value="doc" />
        </ContentDoc>
      </main>
    </div>

    <Nav @click.stop="isMenuShown = !isMenuShown" :close="isMenuShown" @isclose="(e) => isMenuShown = e">
      <Menu></Menu>
        <div v-if="!isToCEmpty">
          <div @click.stop class="ui-box toc relative" v-if="isShowToC">
            <ContentDoc v-slot="{ doc }">
              <ul
                class="table-ul"
                v-for="link of doc.body.toc.links"
                :key="link.id"
              >
                <li class="table-li">
                  <a @click="closeModal()" :href="`#${link.id}`">{{
                    link.text
                  }}</a>
                  <ul v-if="link.children" class="table-ul">
                    <li class="table-li" v-for="children in link.children">
                      <a
                        @click="closeModal()"
                        :href="`#${children.id}`"
                        >{{ children.text }}</a
                      >
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
        
  </div>
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
</style>
