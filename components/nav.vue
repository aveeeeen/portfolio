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

function handleParentClick(e: MouseEvent) {
  if (isMenuShown.value) {
    isMenuShown.value = false;
    emit('isclose', false);
  }
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
  <div v-if="isMobile" class="menu show-right flex-vert gap-10" @click="handleParentClick">
    <div class="header-link" v-if="!props.notShowTitle">
      <NuxtLink class="page-title" to="/">
        <div class="line">
          <span class="line-number">1</span>
          <h3>
            <span class="string">
              "Portfolio site of braven"
            </span>
            <span class="cursor"></span>
          </h3>
        </div>
      </NuxtLink>
    </div>
    <Burger @click.stop="toggleMenu" v-if="!props.notShowTitle" class="burger" :isClose="isMenuShown"></Burger>
    <div v-if="isMenuShown || props.notShowTitle" class="show-right flex-vert gap-10">
      <slot></slot>
      <ThemeToggle />
    </div>
    <ThemeToggle v-else />
  </div>

  <div v-else class="menu show-right flex-vert gap-10" @click="handleParentClick">
    <div class="header-link" v-if="!props.notShowTitle">
      <NuxtLink class="page-title" to="/">
        <div class="line">
          <!-- <span class="line-number">1</span> -->
          <h3>
            <span class="string">
              "Portfolio site of braven"
            </span>
            <span class="cursor"></span>
          </h3>
        </div>
      </NuxtLink>
    </div>
    <slot></slot>
    <ThemeToggle />
  </div>
</template>

<style scoped>
.page-title {
  padding: 0;
  margin: 0;
}

.line {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.line-number {
  color: #aaa;
  font-size: 0.8rem;
  margin-right: 16px;
}

.line>h3 {
  width: fit-content;
  line-height: 2.0rem;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 4px 8px 4px 8px;
  margin: 0;
  color: var(--text-color-a);
  /* border-left: solid 2px #aaa; */
}

.header-link:hover>a>.line>h3>.string {
  background-color: #0014fe;
  color: white;
}

.cursor {
  display: inline-block;
  background-color: transparent;
  width: 0.1rem;
  height: 1.4rem;
  animation: blink 1s steps(1, end) infinite;
  transform: translateX(-0.2rem) translateY(0.35rem);
}

.header-link {
  background-color: var(--ui-bg-color);
  padding: 0px 8px;
  font-family: "Noto Sans Mono", monospace;
  font-optical-sizing: auto;
  letter-spacing: 0.01rch;
  border-radius: var(--box-radius);
}

@keyframes blink {
  0% {
    background-color: #aaa;
  }

  50% {
    background-color: transparent;
  }
}

@media (max-width: 800px) {
  .line-number {
    color: #aaa;
    font-size: 0.7rem;
    margin-right: 16px;
  }

  .line>h3 {
    width: fit-content;
    line-height: 2.0rem;
    letter-spacing: 0.001rch;
    font-weight: 500;
    font-size: 0.9rem;
    padding: 4px 8px 4px 8px;
    margin: 0;
    color: var(--text-color-a);
    border-left: solid 2px #aaa;
  }

  .header-link {
    max-width: 100%;
  }
}
</style>