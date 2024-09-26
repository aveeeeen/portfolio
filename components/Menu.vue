<script setup>

</script>

<template>
  <div class="ui-box">
    <div class="flex-vert gap-5">
      <!-- @click="$emit('gotoHome')" -->
      <NuxtLink  to="/"> home</NuxtLink>
      <NuxtLink to="/about"> about</NuxtLink>
      <NuxtLink to="/works" > works</NuxtLink>
      <NuxtLink to="/playground"> playground </NuxtLink>
      <NuxtLink to="/notes"> notes</NuxtLink>      
    </div>
  </div>
</template>

<style scoped>


</style>
