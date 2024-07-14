<script setup>
const isShowToC = ref(false);
defineProps(["imgSrc"]);
watch(isShowToC);
</script>

<template>
  <div class="page center--">
    <div>
      <main>
        <ContentDoc v-slot="{ doc }">
          <!-- Post title -->

          <!-- Table of contents -->

          <!-- Main post content -->
          <!-- imageSize: 'style' -->

          <ContentRenderer class="content-box" :value="doc"/>
        </ContentDoc>
      </main>
    </div>

    <div class="flex-vert menu show-right">
      <Menu class=""></Menu>
      <div class="">
        <div class="ui-box toc relative" v-if="isShowToC">
          <ContentDoc v-slot="{ doc }">
            <ul class="table-ul">
              <li class="table-li" v-for="link of doc.body.toc.links" :key="link.id">
                <a @click="isShowToC = !isShowToC" :href="`#${link.id}`">{{
                  link.text
                }}</a>
              </li>
            </ul>
          </ContentDoc>
        </div>
        <div v-else class="ui-box relative">
          <a @click="isShowToC = !isShowToC">Table of Contents</a>
        </div>
      </div>
      <div v-if="isShowToC" class="ui-box">
        <a @click="isShowToC = !isShowToC">Close</a>
      </div>
    </div>
  </div>
</template>

<style>
a {
  font-size: 1rem;
  color: blue;
}

.toc {
  max-width: 300px;
  max-height: 300px;
  overflow-x: scroll;
}

.show-right {
  align-items: flex-end;
}

.flex-content {
  display: flex;
  flex-direction: column;
}

img{
  width: 80svw;
  height: auto;
  max-width: 800px;
}

.table-ul{
  padding-left: 15px;
}

.table-li{
  padding-bottom: 5px;
}
</style>
