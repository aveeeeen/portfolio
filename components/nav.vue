<template>
  <div v-if="isMobile" class="menu show-right flex-vert gap-10">
    <Burger @click="isMenuShown = !isMenuShown" class="burger" :isClose="isMenuShown"></Burger>
    <div v-if="isMenuShown" class="show-right flex-vert gap-10">
      <slot></slot>
    </div>
  </div>

  <div v-else class="menu show-right flex-vert gap-10">
    <slot></slot>
  </div>
</template>

<script setup>
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

function checkMobile () {
  if(window.innerWidth > 800){
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