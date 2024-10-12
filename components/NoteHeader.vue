<template>
  <div class="flex-vert note-header gap-20">
    <slot name="title"></slot>
    <slot name="date"></slot>
    <div class="flex-hori gap-10 tags">
      <p>Tags:</p>
      <slot name="tags"></slot>
    </div>
  </div>
</template>

<style>

.note-header{
  margin: 20px;
  padding: 30px 20px;
  border-radius: 20px;
  border: color-mix(in srgb, slateblue 60%, white 30%) solid;
}

.note-header a{
  border: 2px solid;
  padding: 2px 5px ;
  border-radius: 10px;
  border-color: color-mix(in srgb, slateblue 60%, white 30%)
}

.note-header p, h1{
  line-height: 100%;
  margin: 0;
}

.tags{
  flex-wrap: wrap;
  align-items: baseline;
}
</style>