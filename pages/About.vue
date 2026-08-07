<script setup lang="ts">
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import json from 'highlight.js/lib/languages/json'
import twitter from "~/assets/icon/twitter.png";
import instagram from "~/assets/icon/insta.png";
import mail from "~/assets/icon/mail.png";
import github from "~/assets/icon/github.png";
import soundcloud from "~/assets/icon/soundcloud.png";
import youtube from "~/assets/icon/youtube.png";

useSeoMeta({
  description: "About braven",
  ogDescription: "About braven",
});

hljs.registerLanguage('json', json)

const { data } = await useFetch<string>("https://raw.githubusercontent.com/aveeeeen/about-me/refs/heads/main/about-me.json");
const bio = JSON.stringify(JSON.parse(data?.value ?? "error occured while fetching... ;_;)"), null, 2);

const highlightedCode = computed(() => {
  return hljs.highlight(bio, { language: 'json' }).value;
});

const isMenuShown = ref(false);
const socialMedias = ref([
  {
    name: "twitter",
    url: "https://twitter.com/braveeeeen",
    id: 0,
    src: twitter,
  },
  {
    name: "instagram",
    url: "https://www.instagram.com/neeeeevarb/",
    id: 1,
    src: instagram,
  },
  {
    name: "mail",
    url: "mailto:taichimatsumoto360@gmail.com",
    id: 2,
    src: mail,
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/@braven6009",
    id: 3,
    src: youtube,
  },
  {
    name: "soundcloud",
    url: "https://soundcloud.com/braven-music",
    id: 4,
    src: soundcloud,
  },
  {
    name: "github",
    url: "https://github.com/aveeeeen/",
    id: 5,
    src: github,
  },
]);

function closeModal() {
  if (isMenuShown.value) {
    isMenuShown.value = false;
  }
}

</script>

<template>
  <div @click="closeModal()" class="page">
    <div class="center- flex-vert">
      <div class="content-box">
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
    <div class="bottom"></div>
  </div>

  <!-- nav box -->
  <Nav @click="isMenuShown = !isMenuShown" :close="isMenuShown" @isclose="(e) => (isMenuShown = e)">
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

.spacing {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.space {
  height: 2rem;
}

.icon {
  width: 40px;
  height: 40px;
}

.grid-parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 400px;
  row-gap: 20px;
  grid-auto-columns: max-content;
  padding: 20px 0px;
}

.grid-child {
  max-width: 100px;
}


a>div>p {
  margin: 0%;
  border: 0%;
}

.my-metadata {
  display: flex;
  flex-direction: row;
  margin: 0.25rem 0;
  column-gap: 2rem;
}

.meta-head {
  min-width: 90px;
}

dd {
  margin: 0;
}

@media (max-width: 786px) {
  .page-margin {
    margin: 10px;
  }

  .flex-hori {
    flex-direction: column;
    display: flex;
  }

}
</style>
