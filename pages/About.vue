<template>
  <div @click="closeModal()" class="page">
    <div class="center- flex-vert">
        <div class="content-box">
          <h1>About Me</h1>
          <Border></Border>
          
          <div class="spacing">
          
          <ContentTile>
            <div>
            <ul>
              <li>Taichi Matsumoto</li>
              <li>
                  Artist name: &nbsp;&nbsp;&nbsp;
                  braven
              </li>
              <li>
                Institution: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                IAMAS
              </li>
              <li>
                Location: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Gifu, Japan
              </li>
              <li>
                Experties: Live Coding, TidalCycles, NIME, Geneaology of Live
                Coding
              </li>
            </ul>
          </div>
          </ContentTile>

          <!-- picture box -->
          <div class="img-box center-vert margin-left">
            <img class="about-img" src="~/assets/img/matsumoto.png" />
          </div>

          <!-- description -->
          <div>
            <p>
              初めまして、松本です。また、bravenという名で音楽家として活動しています。
            </p>
            <p>
              現在は、iamas（情報芸術科学大学院大学）に在学しており、そこでライブコーディングによる音楽の技術史と文化史がどのように表現を形成しているかについて研究しています。
            </p>
          </div>

          <ContentTile>
              <h3>Find me on:</h3>
            <div class="grid-parent">
              <div class="grid-child" v-for="data in socialMedias" :key="data.id">
                <a :href="data.url">
                  <div class="" style="align-items: center; display: flex; flex-direction: column; gap: 5px;">
                    <img class="icon" :src="data.src" /><img />
                    <p>{{ data.name }}</p>
                  </div>
                </a>
              </div>
            </div>
          </ContentTile>
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


.spacing{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.space{
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

<script setup>
import twitter from "~/assets/icon/twitter.png";
import instagram from "~/assets/icon/insta.png";
import mail from "~/assets/icon/mail.png";
import github from "~/assets/icon/github.png";
import soundcloud from "~/assets/icon/soundcloud.png";
import youtube from "~/assets/icon/youtube.png";

useSeoMeta({
  title: "braveeeeen",
  ogTitle: "protfolio site of braven",
  description: "About braven",
  ogDescription: "About braven",
  ogUrl: "https://braveeeeen.vercel.app/about",
  ogImage:
    "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
  twitterCard: "summary_large_image",
  twitterImage:
    "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
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
