<script setup>
const video = ref(null);
const isVideoLoad = ref(false);

onBeforeMount(() => {
  if (import.meta.client) {
    let html = document.querySelector("html");
    if (html) {
      html.style.backgroundColor = "blue";
      html.classList.remove("dark");
    }
  }
});

onMounted(() => {
  if (import.meta.client) {
    document.documentElement.classList.remove("dark");
  }

  video.value = document.querySelector("video");
  if (video.value) {
    video.value.load();
    video.value.addEventListener("canplaythrough", () => {
      video.value.play();
      isVideoLoad.value = true;
    });
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    let html = document.querySelector("html");
    if (html) {
      html.style.removeProperty("background-color");
    }
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme ? savedTheme === "dark" : prefersDark;

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
});

function videoPlay() {
  setTimeout(() => {
    if (video.value) video.value.play();
  }, 500);
}

watch(isVideoLoad, () => {
  if (!isVideoLoad.value) videoPlay();
});
</script>

<template>
  <div class="page">
    <video class="bg-video" src="~/assets/vid/bgVideo.mp4" preload="none" autoplay playsinline muted loop></video>
  </div>
  <div class="introduction">
    <Introduction></Introduction>
  </div>
  <div class="top-menu">
    <TopMenu></TopMenu>
  </div>
</template>

<style scoped>
.bg-video {
  width: 100svw;
  height: 100svh;
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: -1;
  object-fit: cover;
}

.page {
  width: 100svw;
  height: 100svh;
  position: absolute;
  display: block;
  left: 0%;
  top: 0%;
  padding: 0;
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

.footer-area {
  position: absolute;
  bottom: 0svh;
  width: 100svw;
  z-index: 1;
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
