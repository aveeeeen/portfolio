<script setup lang="ts">
import { boolean } from 'zod';
import ThemeToggle from './ThemeToggle.vue';

type NavProps = {
  close: boolean;
  notShowTitle?: boolean;
};

defineOptions({
  inheritAttrs: false,
});

const isMobile = ref(false);
const isMenuShown = ref(false);

const props = defineProps<NavProps>();

watch(() => props.close, (newVal) => {
  isMenuShown.value = newVal;
});

const emit = defineEmits(['isclose']);

function toggleMenu() {
  isMenuShown.value = !isMenuShown.value;
  emit('isclose', isMenuShown.value);
}

function checkMobile() {
  if (window.innerWidth > 800) {
    isMobile.value = false;
  } else {
    isMobile.value = true;
  }
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<template>
  <div v-if="isMobile" class="menu show-right flex-vert gap-10">
    <div class="ui-box" v-if="!props.notShowTitle">
      <NuxtLink class="page-title" to="/">Portfolio site of braven</NuxtLink>
    </div>
    <Burger v-if="!props.notShowTitle" @click.stop="toggleMenu" class="burger" :isClose="isMenuShown"></Burger>
    <div v-if="isMenuShown || props.notShowTitle" class="show-right flex-vert gap-10">
      <slot></slot>
      <ThemeToggle />
    </div>
    <ThemeToggle v-else />
  </div>

  <div v-else class="menu show-right flex-vert gap-10">
    <div class="ui-box" v-if="!props.notShowTitle">
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