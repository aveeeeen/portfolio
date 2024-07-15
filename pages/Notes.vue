<script setup>
const contentList = await queryContent('/').sort({update: -1, $numeric: true}).find()

</script>

<template>
  <div class="page center--">
    <div class="content-box">
      <h1>Notes</h1>
      <p>new → old</p>
      <hr>
      <ul v-for="content in contentList" :key="content.id">
        <li>
          <NuxtLink :to="content._path">{{ content.title }}</NuxtLink>
          <p>更新日: {{content.update.toString().slice(0,4) + "." + content.update.toString().slice(4,6) + "." + content.update.toString().slice(6,8) }}</p>
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