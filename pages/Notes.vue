<script setup>
const contentList = ref(null);
const contentArrary = ref(null);
const isUpdated = ref(false);
const count = ref(0);
const moveAmount = ref(0);

onMounted(async () => {
  contentList.value = await queryContent('/').only(['title','_path','update','tags']).sort({update: -1, $numeric: true}).find()
  console.log(contentList.value)
  getContent(count.value,5)
  moveAmount.value = Math.floor(contentList.value.length / 5);
  console.log(moveAmount.value)
})

async function getContent (start, move) {
  contentArrary.value = await queryContent('/')
    .only(['title','_path','update','tags'])
    .sort({update: -1, $numeric: true})
    .skip(start)
    .limit(move)
    .find()
  console.log(count.value);
}

function getNextContent () {
  if(count.value == moveAmount.value) return;
  count.value ++;
  getContent(count.value * 5, 5);
}

function getPrevContent () {
  if(count.value == 0) return;
  count.value --;
  getContent(count.value * 5, 5);
}

</script>

<template>
  <div class="page center--">
    <div class="content-box">
      <h1>Notes</h1>
      <p>new → old</p>
      <hr>
      <ul v-for="content in contentArrary">
        <li>
          <NuxtLink :to="content._path">{{ content.title }}</NuxtLink>
          <p>更新日: {{content.update.toString().slice(0,4) + "." + content.update.toString().slice(4,6) + "." + content.update.toString().slice(6,8) }}</p>
        </li>
      </ul>
    </div>
  </div>
  <div class="page-selector flex-hori">
    <div>
      <button @click="getPrevContent()">back</button>
    <button @click="getNextContent()">next</button>
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

.page-selector{
  position: relative;
}

button{
  width: 100px;
  background-color: gray;
  z-index: 3;
}
</style>