<script setup>
const contentList = await queryContent("/").find();
</script>

<template>
  <div class="page center--">
    <div class="content-box">
      <h1>Notes</h1>
      <ul v-for="content in contentList">
        <li>
          <NuxtLink :to="content._path">{{ content.title }}</NuxtLink>
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