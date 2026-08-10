<template>
  <div class="flex-vert note-header gap-20">
    <slot name="title"></slot>
    <div class="flex-vert gap-10">
      <slot name="date"></slot>
      <div class="flex-hori gap-10 tags">
        <p>Tags:</p>
        <slot name="tags"></slot>
      </div>
    </div>
  </div>
</template>

<style>
.note-header {
  padding: 30px 20px;
  border-radius: 20px;
  border: color-mix(in srgb, slateblue 60%, white 30%) solid;
  max-width: 800px;
  width: 90%;
}

.note-header p,
h1 {
  line-height: 100%;
  margin: 0;
}

.tags {
  flex-wrap: wrap;
  align-items: baseline;
}

@media (max-width: 800px) {
  .note-header {
    padding: 30px 20px;
    border-radius: 20px;
    border: color-mix(in srgb, slateblue 60%, white 30%) solid;
    max-width: 700px;
  }
}
</style>