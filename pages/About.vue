<template>
  <div @click="closeModal()" class="page">
    <div class="center-">
        <div class="relative center-hori">
          <div class="flex-hori">
            <div class="content-box">
              <h1>About Me</h1>
              <ul>
                <li>Taichi Matsumoto</li>
                <li>Artist name: braven</li>
                <li>Institution: IAMAS</li>
                <li>I live in Gifu, Japan</li>
                <li>
                  Experties : Live Coding, TidalCycles, NIME, Geneaology of Live
                  Coding
                </li>
              </ul>
            </div>
            <!-- picture box -->
            <div class="img-box center-vert margin-left">
              <img class="about-img" src="~/assets/img/matsumoto.png" />
            </div>
          </div>

          <!-- description -->
          <div class="">
            <div class="content-box">
              <p>
                初めまして、松本です。また、bravenという名で音楽家として活動しています。
              </p>
              <p>
                現在は、iamas（情報芸術科学大学院大学）に在学しており、そこでライブコーディングによる音楽の技術史と文化史がどのように表現を形成しているかについて研究しています。
              </p>

              <h3>Find me on:</h3>
              <div class="grid-parent">
                <div
                  class="grid-child"
                  v-for="data in socialMedias"
                  :key="data.id"
                >
                  <a :href="data.url">
                    <div class="flex-vert center--">
                      <img class="icon" :src="data.src" /><img />
                      <p>{{ data.name }}</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <Footer></Footer>
  </div>

  <!-- nav box -->
  <Nav
    @click="isMenuShown = !isMenuShown"
    :close="isMenuShown"
    @isclose="(e) => (isMenuShown = e)"
  >
    <Menu></Menu>
  </Nav>
</template>

<style scoped>
.about-img {
  width: 35svh;
  height: 35svh;
}

.img-box {
  margin: 30px;
}

.page-margin {
  margin: 80px;
}

.wrapper {
  margin-top: 10px;
  margin-bottom: 10px;
}

.icon {
  width: 40px;
  height: 40px;
}

.grid-parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 400px;
  padding: 10px;
  row-gap: 20px;
}

.grid-child {
  max-width: 100px;
}

.sns {
  width: 20svw;
  height: 20svw;
  max-width: 100px;
  max-height: 100px;
  border-radius: 100%;
  background-color: black;
}

a > div > p {
  margin: 0%;
  border: 0%;
}

@media (max-width: 786px) {
  .page-margin {
    margin: 10px;
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
