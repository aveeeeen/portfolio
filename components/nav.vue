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
  if (window.innerWidth > 1300) {
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
  <header v-if="isMobile">
    <div class="menu-box" @click="handleParentClick">
      <div v-if="!props.notShowTitle" class="menu">
        <div class="header-link">
          <NuxtLink class="page-title" to="/">
            <div class="line">
              <h3>
                <span class="string">
                  "Portfolio of braven"
                </span>
                <span class="cursor"></span>
              </h3>
            </div>
          </NuxtLink>
        </div>
        <div class="menu-group">
          <ThemeToggle />
          <Burger @click.stop="toggleMenu" class="burger" :isClose="isMenuShown"></Burger>
        </div>
      </div>
      <div v-if="isMenuShown || props.notShowTitle" class="menu-slot show-right flex-vert">
        <slot></slot>
        <ThemeToggle v-if="props.notShowTitle"> </ThemeToggle>
      </div>
    </div>
  </header>

  <header v-else class="menu show-right flex-vert" @click="handleParentClick">
    <div class="header-link" v-if="!props.notShowTitle">
      <NuxtLink class="page-title" to="/">
        <div class="line">
          <!-- <span class="line-number">1</span> -->
          <h3>
            <span class="string">
              "Portfolio of braven"
            </span>
            <span class="cursor"></span>
          </h3>
        </div>
      </NuxtLink>
    </div>
    <slot></slot>
    <ThemeToggle />
  </header>
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
  width: fit-content;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--ui-bg-color);
  padding: 0px 8px;
  font-family: "Noto Sans Mono", monospace;
  font-optical-sizing: auto;
  letter-spacing: 0.01rch;
  border-radius: var(--box-radius);
}

.menu {
  position: fixed;
  top: var(--space-s);
  right: 5%;
  z-index: 3;
  gap: var(--space-ms);
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
    font-size: 0.8rem;
    padding: 4px 4px 4px 4px;
    margin: 0;
    color: var(--text-color-a);
  }

  .header-link {
    max-width: 100%;
  }

  header {
    position: fixed;
    top: var(--space-s);
    left: 0px;
    right: unset;
    z-index: 3;
    width: 100svw;
    box-sizing: border-box;
  }

  .menu-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-s);
    padding: 0 var(--space-s);
    box-sizing: border-box;
  }

  .menu {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .menu-group {
    display: flex;
    flex-direction: row;
    gap: var(--space-s);
    align-items: center;
  }

  .menu-slot {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-s)
  }
}

@media (min-width: 800px) and (max-width: 1300px) {

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
    font-size: 0.8rem;
    padding: 4px 4px 4px 4px;
    margin: 0;
    color: var(--text-color-a);
  }

  .header-link {
    max-width: 100%;
  }

  header {
    position: fixed;
    top: var(--space-s);
    left: 0px;
    right: unset;
    z-index: 3;
    width: 100svw;
    box-sizing: border-box;
  }

  .menu-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-s);
    padding: 0 var(--space-s);
    box-sizing: border-box;
  }

  .menu {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
    gap: var(--space-s);
  }

  .menu-group {
    display: flex;
    flex-direction: row;
    gap: var(--space-s);
    align-items: center;
  }

  .menu-slot {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-s)
  }
}
</style>