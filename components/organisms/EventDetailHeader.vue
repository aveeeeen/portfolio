<script setup lang="ts">
import { ref, onMounted } from 'vue';

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
    <slot name="title">
      <h1 v-if="props.title">{{ props.title }}</h1>
    </slot>
    <slot name="date">
      <p v-if="props.date">
        作成日:
        {{
          new Date(props.date).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '.')
        }}
      </p>
    </slot>
    <slot name="venue">
      <p v-if="props.venue">
        会場： {{ props.venue }}
      </p>
    </slot>
    <slot name="img">
      <NuxtImg
        v-if="props.imageUrl"
        ref="imgRef"
        :src="props.imageUrl"
        format="webp"
        :class="{ portrait: isPortrait }"
        @load="handleImageLoad"
      />
    </slot>
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
}

img.portrait {
  height: 50vh;
  width: auto;
}

@media (max-width: 800px) {
  .note-header {
    padding: 30px 20px;
    border-radius: 20px;
    border: color-mix(in srgb, slateblue 60%, white 30%) solid;
    max-width: 700px;
    width: 80%;
  }
}
</style>