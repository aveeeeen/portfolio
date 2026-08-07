<script setup>
import ThemeToggle from './ThemeToggle.vue';

const isMobile = ref(false);
const isMenuShown = ref(false);

const props = defineProps({
  close: Boolean
})

watch(() => props.close, () => {
  isMenuShown.value = props.close;
  console.log("from nav:" + isMenuShown.value)
});

const emit = defineEmits(['isclose'])
emit('isclose', isMenuShown.value)

function checkMobile() {
  if (window.innerWidth > 800) {
    isMobile.value = false
  } else {
    isMobile.value = true
  }
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', () => checkMobile())
})

onUnmounted(() => {
  window.removeEventListener('resize', () => checkMobile())
})
</script>

<template>
  <div v-if="isMobile" class="menu show-right flex-vert gap-10">
    <div class="ui-box">
      <NuxtLink class="page-title" to="/">Portfolio site of braven</NuxtLink>
    </div>
    <Burger @click="isMenuShown = !isMenuShown" class="burger" :isClose="isMenuShown"></Burger>
    <div v-if="isMenuShown" class="show-right flex-vert gap-10">
      <slot></slot>
      <ThemeToggle />
    </div>
    <ThemeToggle v-else />
  </div>

  <div v-else class="menu show-right flex-vert gap-10">
    <div class="ui-box">
      <NuxtLink class="page-title" to="/">Portfolio site of braven</NuxtLink>
    </div>
    <slot></slot>
    <ThemeToggle />
  </div>
</template>

<style scoped>
.page-title {
  margin: 0 4px;
}
</style>