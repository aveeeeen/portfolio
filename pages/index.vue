<script setup>
const video = ref(null);
const isVideoLoad = ref(false);

onMounted(() => {
  video.value = document.querySelector("video");
  video.value.load();

  video.value.addEventListener("canplaythrough", (event) => {
    video.value.play();
    isVideoLoad.value = true;
  });
});

useSeoMeta({
  title: 'braveeeeen',
  ogTitle: 'protfolio site of braven',
  ogUrl: "https://braveeeeen.vercel.app" ,
  ogType: "website",
  ogImage: "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
  twitterCard: "summary_large_image",
  twitterImage: "https://raw.githubusercontent.com/aveeeeen/portfolio/main/assets/img/ogp.png",
}) 

function videoPlay() {
  setTimeout(() => {
    video.value.play();
  }, 500);
}

watch(isVideoLoad, () => {
  if(!isVideoLoad.value) videoPlay();
  console.log(isVideoLoad.value);
});
</script>

<template>
  
    <video
      class="bg-video"
      src="~/assets/vid/bgVideo.mp4"
      preload="none"
      autoplay
      playsinline
      muted
      loop
    ></video>
    <div class=" introduction">
      <Introduction></Introduction>
    </div>

    <div class="top-menu">
      <TopMenu @click="isHomeClicked = !isHomeClicked"></TopMenu>
    </div>
  
</template>

<style scoped>
.bg-video {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: 0;
  object-fit: cover;
}

.introduction {
  position: absolute;
  left: 10%;
  top: 5%;
}

.top-menu{
  position: absolute;
  left: 10%;
  top: 70%;
}

@media (max-width: 786px) {
  .introduction {
    align-items: center;
    left: 0%;
  }

  .top-menu{
    position: absolute;
    left: 0%;
    top: 70%;
  }
}
</style>
