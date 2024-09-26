<script setup>



</script>

<template>
   
    <div class="flex-vert show-left top-nav">
      <NuxtLink to="/about"> about </NuxtLink>
      <NuxtLink to="/works"> works </NuxtLink>
      <NuxtLink to="/playground"> playground </NuxtLink>
      <NuxtLink to="/notes"> notes </NuxtLink>
    </div>
</template>

<style scoped>
.top-nav > a{
  display: inline;
  background-color: var(--text-bg-color-a);
  color: var(--text-color-a);
  font-size: 1.25rem;
  text-align: center;
  padding: 2px 10px;
  margin-bottom: 10px;
}
</style>
