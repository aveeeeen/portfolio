<template>
  <div class="tile">
    <div class="content">
      <slot></slot>
    </div> 
  </div>
</template>

<style scoped>
.tile{
  padding: 10px 20px;
  border-radius: 10px;
  background-color: var(--tile-bg-color);
  width: 2000px;
}

.content{
  width: fit-content;
  max-width: 80svw;
}
</style>