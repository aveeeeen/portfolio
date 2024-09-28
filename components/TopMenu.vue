<script setup>



</script>

<template>
    <div class="flex-hori top-nav">
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
  padding: 2px 5px;
}

a:hover{
  color: white;
  display: inline;
  background-color: blue;
}
</style>
