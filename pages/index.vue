<script setup lang="ts">
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const isUnderPageHeight = ref(false);
const isMenuShown = ref(false);
useTheme();

const { data } = await useFetch<string>("https://raw.githubusercontent.com/aveeeeen/about-me/refs/heads/main/about-me.json");
const bio = JSON.stringify(JSON.parse(data?.value ?? "error occured while fetching... ;_;)"), null, 2);

const highlightedCode = computed(() => {
  return hljs.highlight(bio, { language: 'json' }).value;
});

const getIsUnder = () => {
  const aboutEl = document.getElementById('about');
  isUnderPageHeight.value = window.scrollY > (aboutEl?.offsetTop ?? window.innerHeight) - 64;
}

onMounted(() => {
  console.log("mounted")
  window.addEventListener("scroll", () => {
    getIsUnder()
  })
})

onUnmounted(() => {
  document.removeEventListener("scroll", getIsUnder);
});

function scrollToAbout() {
  const aboutEl = document.getElementById('about');
  if (aboutEl) {
    aboutEl.scrollIntoView({ behavior: 'smooth' });
  }
}

</script>

<template>
  <video class="bg-video" src="~/assets/vid/bgVideo.mp4" preload="none" autoplay playsinline muted loop></video>
  <div class="hero-box">
    <div class="introduction">
      <Introduction></Introduction>
    </div>
    <a class="scroll-indication-anchor" href="#about" @click.prevent="scrollToAbout">
      <div class="scroll-indication-box">
        <span class="scroll-indication">Know About me</span>
      </div>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-chevron-down-icon lucide-chevron-down">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </a>
  </div>
  <div class="center- flex-vert about-section" id="about">
    <div class="content-box index-content-box">
      <h1>About Me</h1>
      <Border></Border>
      <div class="spacing">
        <pre class="code-block"><code class="hljs language-json code-padding" v-html="highlightedCode"></code></pre>
        <!-- picture box -->
        <div class="img-box center-vert margin-left">
          <NuxtImg class="about-img" src="/img/matsumoto.png" format="webp" />
        </div>
        <!-- description -->
      </div>
    </div>
  </div>
  <Footer></Footer>
  <!-- nav box -->
  <Nav v-if="isUnderPageHeight" :close="isMenuShown" @isclose="(e) => (isMenuShown = e)" :notShowTitle="true">
    <Menu></Menu>
  </Nav>
</template>

<style scoped>
.about-img {
  width: 35svh;
  height: 35svh;
}

.img-box {
  margin: 0px;
}

.page-margin {
  margin: 80px;
}

.wrapper {
  margin-top: 10px;
  margin-bottom: 10px;
}

.code-block {
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: anywhere;
  overflow-x: hidden;
  border-radius: 16px;
  max-width: 800px;
}

.code-padding {
  padding: 32px;
}

.icon {
  width: 40px;
  height: 40px;
}

.bg-video {
  width: 100vw;
  height: 100svh;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
  object-fit: cover;
}

.hero-box {
  width: 100%;
  height: 100svh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 8px;
  background-color: transparent;
}

.scroll-indication-anchor {
  margin-top: 80svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.scroll-indication-box {
  width: fit-content;
  height: fit-content;
  padding: 8px;
  background-color: white;
  border: none;
  border-radius: 12px;
}

.scroll-indication {
  font-weight: 350;
  color: blue;
  font-size: 1rem;
}

.scroll-indication-anchor:hover>.scroll-indication-box>.scroll-indication {
  color: white;
  background-color: blue;
}

.introduction {
  position: absolute;
  left: 10%;
  top: 5%;
  z-index: 1;
}

.top-menu {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.about-section {
  position: relative;
  width: 100%;
  height: auto;
  background-color: var(--bg-color);
}

.index-content-box {
  margin-top: 54px;
  margin-bottom: 54px;
}

@media (max-width: 800px) {
  .introduction {
    align-items: center;
    left: 0%;
  }

  .top-menu {
    position: absolute;
    left: 0%;
    bottom: 10svh;
  }
}
</style>
