<script setup>
const isShowToC = ref(false);
defineProps(["imgSrc"]);
watch(isShowToC, )
</script>

<template>
  <div class="page center--">
    <div class="content-box">
      <main>
        <ContentDoc v-slot="{ doc }">
          <!-- Post title -->

          <!-- Table of contents -->

          <!-- Main post content -->
          <ContentRenderer :value="doc" />
        </ContentDoc>
      </main>
    </div>
  </div>

  <div class="flex-vert menu show-right">
    <Menu class=""></Menu>
    <div class="">
      <div class="ui-box toc relative" v-if="isShowToC">
        <ContentDoc v-slot="{ doc }">
        <ul>
          <li v-for="link of doc.body.toc.links" :key="link.id">
            <a :href="`#${link.id}`">{{ link.text }}</a>
          </li>
        </ul>
        </ContentDoc>
      </div>
      <div v-else class="ui-box relative">
        <a @click="isShowToC = !isShowToC">Table of Contents</a>
      </div>
    </div>
    <div v-if="isShowToC" class="ui-box">
      <a  @click="isShowToC = !isShowToC">Close</a>
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
}

.relative{
  position: relative;
}

.show-right{
  align-items: flex-end;
}
</style>
