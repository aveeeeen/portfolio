<template>
  <div class="flex-vert note-post gap-20">
    <slot name="title"></slot>
    <slot name="date"></slot>
    <div class="flex-hori gap-10 tags">
      <p>Tags:</p>
      <slot name="tags"></slot>
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

.note-post .tags a{
  border: 2px solid;
  padding: 2px 5px ;
  border-radius: 10px;
  border-color: color-mix(in srgb, slateblue 60%, white 30%);
  font-size: 0.8rem;
}

.note-post p, a{
  line-height: 120%;
  margin: 0;
}

.tags{
  flex-wrap: wrap;
  align-items: baseline
}
</style>