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
  <div class="intro-area">
    <div class="intro-box" id="about">
      <div class="intro-content">
        <div class="intro">
          <h1>Taichi Matsumoto (braven)</h1>
          <h3>Live Coder, Musician, Programmer</h3>
        </div>
        <a v-if="!isUnderPageHeight" class="scroll-indication-anchor" href="#about" @click.prevent="scrollToAbout">
          <div class="scroll-indication-box">
            <span class="scroll-indication">Know About me</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
            fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" class="scroll-indication-arrow">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </a>
      </div>
    </div>
  </div>
  <div class="hero-box">
  </div>
  <div class="center- flex-vert about-section">
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

.intro-area {
  position: absolute;
  padding: 0px;
  margin: 0px;
  top: 0px;
  left: 0px;
  width: 100svw;
  height: 100svh;
  z-index: 2;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.intro-box {
  height: 16svh;
  width: 100%;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.intro-content {
  max-width: 1400px;
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  align-items: flex-end;
  padding: 32px;
}

.intro {
  width: fit-content;
}

.intro>h1 {
  line-height: 1.0;
  font-weight: 300;
  font-size: 2rem;
}

.intro>h3 {
  line-height: 2.0;
  font-weight: 300;
  font-size: 1rem;
}


.scroll-indication-anchor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: 1;
  margin-bottom: 24px
}

.scroll-indication-box {
  width: fit-content;
  height: fit-content;
  padding: 8px;
  border: none;
  background-color: var(--bg-color);
}

.scroll-indication {
  font-weight: 200;
  font-size: 1rem;
  color: var(--text-color);
}

.scroll-indication-arrow {
  stroke: var(--text-color);
}

.scroll-indication-anchor:hover>.scroll-indication-box {
  background-color: #0014FE;
}

.scroll-indication-anchor:hover>.scroll-indication-arrow {
  stroke: white;
}

.scroll-indication-anchor:hover .scroll-indication {
  color: white;
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
  .intro-box {
    height: 25%;
    overflow: hidden;
  }

  .intro-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
  }

  .intro {
    width: 100%;
    margin-left: 32px;
    justify-self: flex-start;
  }

  .intro>h1 {
    line-height: 1.0;
    font-weight: 300;
    font-size: 1.4rem;
  }

  .intro>h3 {
    line-height: 2.0;
    font-weight: 300;
    font-size: 0.8rem;
  }

  .scroll-indication-anchor {
    margin: 0;
  }

  .top-menu {
    position: absolute;
    left: 0%;
    bottom: 10svh;
  }
}
</style>
