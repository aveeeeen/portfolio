<template>
  <div v-if="isMobile" class="menu show-right flex-vert">
    <Theme @click.stop="isDarkmode = !isDarkmode"></Theme>
    <Burger
      @click="isMenuShown = !isMenuShown"
      class="burger"
      :isClose="isMenuShown"
    ></Burger>
    <div v-if="isMenuShown" class="show-right flex-vert">
      <slot></slot>
    </div>
  </div>

  <div v-else class="menu show-right flex-vert">
    <Theme @click.stop="isDarkmode = !isDarkmode"></Theme>
    <slot></slot>
  </div>
</template>

<script setup>
const isMobile = ref(false);
const isMenuShown = ref(false);
const isDarkmode = ref(false);

const props = defineProps({
  close: Boolean,
});

watch(
  () => props.close,
  () => {
    isMenuShown.value = props.close;
    console.log("from nav:" + isMenuShown.value);
  }
);

const emit = defineEmits(["isclose"]);
emit("isclose", isMenuShown.value);

function checkMobile() {
  if (window.innerWidth > 760) {
    isMobile.value = false;
  } else {
    isMobile.value = true;
  }
}

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", () => checkMobile());
});

onUnmounted(() => {
  if (isDarkmode.value) {
    const colorPalete = {
      html: "rgb(25,25,25)",
      bg: "rgb(40,40,40)",
      uibg: "rgb(100,100,100)",
      abg: "rgb(10,10,10)",
    };
    const r = document.querySelector(":root");
    r.style.setProperty("--text-color", "white");
    r.style.setProperty("--text-color-a", "rgb(200,200,255)");
    r.style.setProperty("--text-bg-color", colorPalete.bg);
    r.style.setProperty("--text-bg-color-a", colorPalete.abg);
    r.style.setProperty("--ui-bg-color", colorPalete.uibg);
    r.style.setProperty("--bg-color", colorPalete.bg);
    document.querySelector("html").style.backgroundColor = colorPalete.html;
  } else {
    const colorPalete = {
      html: "blue",
      bg: "rgb(245, 245, 255)",
      uibg: "white",
      text: "black",
      a: "blue",
    };
    const r = document.querySelector(":root");
    r.style.setProperty("--text-color", colorPalete.text);
    r.style.setProperty("--text-color-a", colorPalete.a);
    r.style.setProperty("--text-bg-color", colorPalete.bg);
    r.style.setProperty("--text-bg-color-a", colorPalete.uibg);
    r.style.setProperty("--ui-bg-color", colorPalete.uibg);
    r.style.setProperty("--bg-color", colorPalete.bg);
    document.querySelector("html").style.backgroundColor = colorPalete.html;
  }

  window.removeEventListener("resize", () => checkMobile());
});

//default
// --bg-color: rgb(245, 245, 255);
// --ui-bg-color: white;
// --text-color: black;
// --text-color-a: blue;
// --text-bg-color: white;
// --text-bg-color-a: white;

function defaultTheme() {
  const colorPalete = {
    html: "blue",
    bg: "rgb(245, 245, 255)",
    uibg: "white",
    text: "black",
    a: "blue",
  };
  const r = document.querySelector(":root");
  r.style.setProperty("--text-color", colorPalete.text);
  r.style.setProperty("--text-color-a", colorPalete.a);
  r.style.setProperty("--text-bg-color", colorPalete.bg);
  r.style.setProperty("--text-bg-color-a", colorPalete.uibg);
  r.style.setProperty("--ui-bg-color", colorPalete.uibg);
  r.style.setProperty("--bg-color", colorPalete.bg);
  document.querySelector("html").style.backgroundColor = colorPalete.bg;
}

function darkmode() {
  const colorPalete = {
    html: "rgb(25,25,25)",
    bg: "rgb(40,40,40)",
    uibg: "rgb(100,100,100)",
    abg: "rgb(10,10,10)",
  };
  const r = document.querySelector(":root");
  r.style.setProperty("--text-color", "white");
  r.style.setProperty("--text-color-a", "rgb(200,200,255)");
  r.style.setProperty("--text-bg-color", colorPalete.bg);
  r.style.setProperty("--text-bg-color-a", colorPalete.abg);
  r.style.setProperty("--ui-bg-color", colorPalete.uibg);
  r.style.setProperty("--bg-color", colorPalete.bg);
  document.querySelector("html").style.backgroundColor = colorPalete.bg;
}

watch(isDarkmode, async () => {
  await nextTick();
  if (isDarkmode.value) {
    darkmode();
    console.log("is darkmode");
  } else {
    defaultTheme();
    console.log("is not darkmode");
  }
});
</script>

<style scoped></style>
