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



function videoPlay() {
  setTimeout(() => {
    video.value.play();
  }, 500);
}

watch(isVideoLoad, () => {
  videoPlay();
  console.log(isVideoLoad.value);
});
</script>

<template>
  <head>
    <meta property="og:description" content='portfoli site of braven' />
        <meta property="og:title" content="braveeeeen" />
        <meta property="og:url" content="https://braveeeeen.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:image" href="../assets/img/ogp.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" href="../assets/img/ogp.png" />
        <link rel=”icon” href="../assets/icon/favicon.ico">
  </head>
    <video
      class="bg-video"
      src="~/assets/vid/bgVideo.mp4"
      preload="none"
      autoplay
      playsinline
      muted
      loop
    ></video>
    <div class="ui-box introduction">
      <Introduction></Introduction>
    </div>
    <div class="menu">
      <TopMenu @click="isHomeClicked = !isHomeClicked"></TopMenu>
    </div>
  
</template>

<style>
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
  top: 10%;
}

@media (max-width: 786px) {
  .introduction {
    align-items: center;
    left: 0%;
  }
}
</style>
