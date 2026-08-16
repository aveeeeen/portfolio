<script setup lang="ts">
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const isUnderPageHeight = ref(false);
const isMenuShown = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
useTheme();

useSeoMeta({
  ogUrl: 'https://braveeeeen.com/',
});

const { data } = await useFetch<string>("https://raw.githubusercontent.com/aveeeeen/about-me/refs/heads/main/about-me.json");
const bio = JSON.stringify(JSON.parse(data?.value ?? "error occured while fetching... ;_;)"), null, 2);

const highlightedCode = computed(() => {
  const code = hljs.highlight(bio, { language: 'json' }).value;
  return code.replace(
    /<span class="hljs-string">(&quot;|")?(https?:\/\/[^"<\s]+?)(&quot;|")?<\/span>/g,
    (match, q1, rawUrl, q2) => {
      const quote1 = q1 || '';
      const quote2 = q2 || '';
      const href = rawUrl.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="code-url-link"><span class="hljs-string">${quote1}${rawUrl}${quote2}</span></a>`;
    }
  );
});

const getIsUnder = () => {
  const aboutEl = document.getElementById('about');
  isUnderPageHeight.value = window.scrollY > (aboutEl?.offsetTop ?? window.innerHeight) - 32;
}

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.muted = true;
    videoRef.value.play().catch((err) => {
      console.warn("Video autoplay prevented:", err);
    });
  }
  window.addEventListener("scroll", getIsUnder);
});

onUnmounted(() => {
  window.removeEventListener("scroll", getIsUnder);
});

function scrollToAbout() {
  const aboutEl = document.getElementById('about');
  if (aboutEl) {
    aboutEl.scrollIntoView({ behavior: 'smooth' });
  }
}

</script>

<template>
  <video
    ref="videoRef"
    class="bg-video"
    src="~/assets/vid/bgVideo.mp4"
    autoplay
    playsinline
    webkit-playsinline
    :muted="true"
    muted
    loop
    preload="auto"
  ></video>
  <div class="intro-area">
    <div class="intro-box">
      <div class="intro-content">
        <div class="intro">
          <div class="line">
            <span class="line-number">1</span>
            <h1>Taichi Matsumoto (braven)</h1>
          </div>
          <div class="line">
            <span class="line-number">2</span>
            <h3>
              <span class="keyword">let</span> <span>braven</span> = [<span class="string">"Live Coder"</span>,
              <span class="string">"Musician"</span>, <span class="string">"Programmer"</span>]
              <span class="cursor"></span>
            </h3>
          </div>
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
  <div class="center- flex-vert about-section" id="about">
    <div class="content-box index-content-box">
      <h1>About Me</h1>
      <Border></Border>
      <pre class="code-block"><code class="hljs language-json code-padding" v-html="highlightedCode"></code></pre>
      <!-- picture box -->
      <div class="img-box center-vert margin-left">
        <img class="about-img" src="/img/matsumoto.png" alt="Matsumoto" />
      </div>
      <!-- description -->
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
  width: 35vh;
  height: 35vh;

}

.img-box {
  margin: 0px;
}

.code-block {
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.6;
  overflow-wrap: anywhere;
  overflow-x: hidden;
  border-radius: 16px;
  max-width: 800px;
}

.code-padding {
  padding: 32px;
}

:deep(.code-url-link) {
  text-decoration: underline;
  color: #96C178;
}

:deep(.code-url-link:hover),
:deep(.code-url-link:hover .hljs-string) {
  color: white !important;
  background-color: #0014fe !important;
}

.icon {
  width: 40px;
  height: 40px;
}

.bg-video {
  width: 100svw;
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
  overflow: hidden;
}

.intro-box {
  height: 25svh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  -webkit-backdrop-filter: blur(64px);
  backdrop-filter: blur(64px);
}

.intro-content {
  max-width: 1400px;
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-s);
}

.intro {
  width: fit-content;
  padding: 0 var(--space-s);
  font-family: "Noto Sans Mono", monospace;
  font-optical-sizing: auto;
  letter-spacing: 0.01rch;
}

.line {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.line-number {
  color: #ccc;
  margin-right: 16px;
}

.line>h1 {
  display: block;
  width: fit-content;
  line-height: 1.0;
  font-weight: 450;
  font-size: 2rem;
  padding: 8px 32px;
  margin: 0;
  color: #eee;
  border-left: solid 2px #eee;
}

.line>h3 {
  width: fit-content;
  line-height: 2.0;
  font-weight: 350;
  font-size: 1rem;
  padding: 4px 32px;
  margin: 0;
  color: #eee;
  border-left: solid 2px #eee;
}

.string {
  color: #F19A55;
}

.keyword {
  color: #FF7B72;
}

.cursor {
  display: inline-block;
  background-color: transparent;
  width: 0.1rem;
  height: 1.5rem;
  animation: blink 1s steps(1, end) infinite;
  transform: translateY(0.4rem) translateX(-0.5rem);
}

@keyframes blink {
  0% {
    background-color: #ccc;
  }

  50% {
    background-color: transparent;
  }
}

.scroll-indication-anchor {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: 1;
  margin-bottom: 24px;
  background-color: transparent;
}

.scroll-indication-box {
  width: fit-content;
  height: fit-content;
  padding: 8px;
  border-top: solid 2px #eee;
}

.scroll-indication {
  font-weight: 600;
  font-size: 1rem;
  color: #eee;
}

.scroll-indication-arrow {
  stroke: #eee;
}

.scroll-indication-anchor:hover {
  background-color: #eee;
}

.scroll-indication-anchor:hover>.scroll-indication-arrow {
  stroke: #0014fe;
}

.scroll-indication-anchor:hover .scroll-indication {
  color: #0014fe;
}

.about-section {
  position: relative;
  width: 100%;
  height: auto;
  background-color: var(--bg-color);
  overflow-x: hidden;
}

.index-content-box {
  margin-top: 56px;
  margin-bottom: 56px;
}

@media (max-width: 800px) {

  .intro-box {
    height: 40%;
    max-height: 240px;
  }

  .intro-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 24px 0 24px 0;
  }

  .intro {
    width: 100%;
    margin-left: 24px;
    justify-self: flex-start;
  }

  .line-number {
    font-size: 0.8rem;
  }

  .line>h1 {
    line-height: 1.2;
    font-weight: 600;
    font-size: 1.5rem;
    padding: 8px 16px;
  }

  .line>h3 {
    /* height: calc(1.5rem * 1.2 + 32px); */
    line-height: 1.0;
    font-weight: 400;
    font-size: 0.8rem;
    padding: 8px 16px;
    flex-direction: row;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .cursor {
    background-color: transparent;
    display: inline-block;
    width: 1px;
    height: 1.2rem;
    margin: 0;
    padding: 0;
    transform: translateY(0.3rem) translateX(-0.4rem);
  }

  .scroll-indication {
    font-size: 0.7rem;
  }

  .scroll-indication-box {
    padding: 2px;
    border-top: solid 2px #eee;
  }

  .scroll-indication-anchor {
    margin: 0;
  }
}
</style>
