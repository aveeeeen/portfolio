<script setup>



</script>

<template>
   
    <div class="nav-center top-nav">
      <NuxtLink to="/about"> &nbsp; about &nbsp; </NuxtLink>
      <NuxtLink to="/works"> &nbsp; works &nbsp; </NuxtLink>
      <NuxtLink to="/notes"> &nbsp; notes &nbsp; </NuxtLink>
    </div>
</template>

<style scoped>
.top-nav > a{
  display: inline;
  background-color: var(--text-bg-color-a);
  color: var(--text-color-a);
  font-size: 1.25rem;
  line-height: normal;
  margin-bottom: 10px;
  border-radius: var(--box-radius);
  margin-left: 10px;
}
</style>
