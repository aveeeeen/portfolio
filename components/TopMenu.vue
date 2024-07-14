<script setup>
</script>


<template>
 <div class="ui-box">
    <div class="center">
      <NuxtLink to="/about"> about</NuxtLink>
      <NuxtLink to="/works"> works</NuxtLink>
      <NuxtLink to="/notes"> notes</NuxtLink>
    </div>
  </div>
</template>

<style>

.center{
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.menuItems{
  flex : 1;
}

</style>
