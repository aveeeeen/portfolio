<template>
  <div v-if="isMobile" class="menu show-right flex-vert">
    <Burger @click="isMenuShown = !isMenuShown" class="burger" :isClose="isMenuShown"></Burger>

    <div v-if="isMenuShown || close">
      <slot></slot>
    </div>
  </div>

  <div v-else class="menu show-right flex-vert">
    <slot></slot>
  </div>
</template>

<script setup>
import Burger from "./burger.vue";

const isMobile = ref(false);
const isMenuShown = ref(false);

const props = defineProps({
  close: Boolean
})

const emit = defineEmits(['isClose'])
emit('isclose', isMenuShown.value)

function checkMobile () {
  if(window.innerWidth > 760){
      isMobile.value = false
    }else{
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

<style scoped>

</style>