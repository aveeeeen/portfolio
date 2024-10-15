<template>
  <div class="flex-vert gap-10">
    <Skelton class="post"></Skelton>
    <Skelton class="update"></Skelton>
    <div class="flex-hori gap-10 tags">
      <Skelton class="tag" v-for="i in 5"></Skelton>
    </div>
  </div>
</template>

<style>
.post{
  width: 80%;
  height: 1rem;
  border-radius: 20px;
}

.update{
  width: 30%;
  height: 1rem;
  border-radius: 20px;
}

.tag{
  width: 30px;
  height: 0.8rem;
  border-radius: 20px;
}

.tags{
  flex-wrap: wrap;
  align-items: baseline
}

</style>