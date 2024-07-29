<script setup>
const video = ref(null);
const isVideoLoad = ref(false);
const isDarkmode = ref(false);


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

function defaultTheme () {
  const colorPalete = {
    html: "blue",
    bg: "rgb(245, 245, 255)",
    uibg: "white",
    text: "black",
    a: "blue"
  }
  const r = document.querySelector(':root');
  r.style.setProperty("--text-color", colorPalete.text);
  r.style.setProperty("--text-color-a", colorPalete.a);
  r.style.setProperty("--text-bg-color", colorPalete.bg);
  r.style.setProperty("--text-bg-color-a", colorPalete.uibg);
  r.style.setProperty("--ui-bg-color", colorPalete.uibg);
  r.style.setProperty("--bg-color", colorPalete.bg);
  document.querySelector("html").style.backgroundColor = colorPalete.html;
}

function darkmode () {
  const colorPalete = {
    html:"rgb(25,25,25)",
    bg: "rgb(40,40,40)",
    uibg: "rgb(100,100,100)",
    abg: "rgb(10,10,10)"
  }
  const r = document.querySelector(':root');
  r.style.setProperty("--text-color", "white");
  r.style.setProperty("--text-color-a", "rgb(200,200,255)");
  r.style.setProperty("--text-bg-color", colorPalete.bg);
  r.style.setProperty("--text-bg-color-a", colorPalete.abg);
  r.style.setProperty("--ui-bg-color", colorPalete.uibg);
  r.style.setProperty("--bg-color",colorPalete.bg);
  document.querySelector("html").style.backgroundColor = colorPalete.html;
}

watch(isDarkmode, async () => {
  await nextTick();
  if(isDarkmode.value){
    darkmode();
    console.log("is darkmode")
  }else{
    defaultTheme();
    console.log("is not darkmode")
  }
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
      <TopMenu></TopMenu>
    </div>

    <div class="menu show-right">
      <Theme @click="isDarkmode = !isDarkmode"></Theme>
    </div>
  
</template>

<style scoped>
.bg-video {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: -1;
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
