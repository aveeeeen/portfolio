<template>
  <div class="flex-vert gap-20 note-post">
    <Skelton class="post"></Skelton>
    <Skelton class="update"></Skelton>
    <div class="flex-hori gap-10 tags">
      <Skelton class="tag" v-for="i in 5"></Skelton>
    </div>
  </div>
</template>

<style>
.note-post{
  margin: 10px 0px;
  padding: 10px;
  border-radius: 10px;
  /* background-color: color-mix(in srgb, gray 10%, white 20%) */
}

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