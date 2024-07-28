<script setup>

</script>

<template>
  <div class="ui-box">
    <div class="nav-center">
      <NuxtLink @click="$emit('gotoHome')" to="/"> home</NuxtLink>
      <NuxtLink to="/about"> about</NuxtLink>
      <NuxtLink to="/works" > works</NuxtLink>
      <NuxtLink to="/notes"> notes</NuxtLink>      
    </div>
  </div>
</template>

<style scoped>


</style>
