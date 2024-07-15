<script setup>
const contentList = await queryContent('/').find()
const creationDate = ref();

async function getCreationDate () {
  creationDate.value = await queryContent('/').only('head').find()
  console.log(creationDate.value);
}

getCreationDate();

console.log(contentList.value);
</script>

<template>
  <div class="page center--">
    <div class="content-box">
      <h1>Notes</h1>
      <ul v-for="content in contentList" :key="content.id">
        <li>
          <NuxtLink :to="content._path">{{ content.title }}</NuxtLink>
          <p>更新日: {{ creationDate.value[0].head}}</p>
        </li>
      </ul>
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

h2{
  text-decoration: none;
  font-size: 2rem;
}
</style>