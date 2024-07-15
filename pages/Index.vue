<script setup>
</script>

<template>
  <video class="bg-video" src="~/assets/vid/bgVideo.mp4" preload="auto" poster="" autoplay
                muted loop>
            </video>
  <div class="ui-box introduction">
    <Introduction></Introduction>
  </div>
  <div class="menu">
    <TopMenu></TopMenu>
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

.introduction{
  position: absolute;
  left :10%;
  top: 10%;
}

@media (max-width: 786px) {
  .introduction{
    align-items: center;
    left: 0%;
  }
}
</style>
