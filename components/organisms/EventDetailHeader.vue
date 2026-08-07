<script setup lang="ts">
import { ref, onMounted } from 'vue';

const dateToLocal = useDate;
const props = defineProps<{
  title?: string;
  date?: string;
  venue?: string;
  imageUrl?: string;
}>();

const isPortrait = ref(false);
const imgRef = ref<HTMLImageElement | null>(null);

function handleImageLoad(event?: Event) {
  const img = (event?.target as HTMLImageElement) || imgRef.value;
  if (img && img.naturalWidth && img.naturalHeight) {
    isPortrait.value = img.naturalHeight > img.naturalWidth;
  }
}

onMounted(() => {
  if (imgRef.value && imgRef.value.complete) {
    handleImageLoad();
  }
});
</script>

<template>
  <div class="flex-vert note-header gap-20">
    <h1 v-if="props.title">{{ props.title }}</h1>
    <div class="flex-vert gap-10">
      <p v-if="props.date">
        開催日時:
        {{
          dateToLocal(new Date(props.date))
        }}
      </p>
      <p v-if="props.venue">
        会場: {{ props.venue }}
      </p>
    </div>
    <NuxtImg v-if="props.imageUrl" ref="imgRef" :src="props.imageUrl" format="webp" :class="{ portrait: isPortrait }"
      @load="handleImageLoad" />
  </div>
</template>

<style scoped>
.note-header {
  padding: 30px 20px;
  border-radius: 20px;
  border: color-mix(in srgb, slateblue 60%, white 30%) solid;
  max-width: 700px;
  width: 90%;
}

.note-header a {
  border: 2px solid;
  padding: 2px 5px;
  border-radius: 10px;
  border-color: color-mix(in srgb, slateblue 60%, white 30%);
}

.note-header p,
h1 {
  line-height: 100%;
  margin: 0;
}

.tags {
  flex-wrap: wrap;
  align-items: baseline;
}

img {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  align-self: center;
}

img.portrait {
  height: 40vh;
  width: fit-content;
  align-self: center;
}

@media (max-width: 800px) {
  .note-header {
    padding: 30px 20px;
    border-radius: 20px;
    border: color-mix(in srgb, slateblue 60%, white 30%) solid;
    max-width: 700px;
  }
}
</style>