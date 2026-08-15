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
const isImageLoaded = ref(false);
const imgRef = ref<HTMLImageElement | null>(null);

function handleImageLoad(event?: Event) {
  const img = (event?.target as HTMLImageElement) || imgRef.value;
  if (img && img.naturalWidth && img.naturalHeight) {
    isPortrait.value = img.naturalHeight > img.naturalWidth;
  }
  isImageLoaded.value = true;
}

function handleImageError() {
  isImageLoaded.value = true;
}

onMounted(() => {
  if (!props.imageUrl) {
    isImageLoaded.value = true;
    return;
  }
  const imgEl = imgRef.value;
  if (imgEl && imgEl.complete && imgEl.naturalWidth) {
    handleImageLoad({ target: imgEl } as any);
  }
});
</script>

<template>
  <div class="flex-vert note-header gap-20">
    <slot name="title">
      <h1 v-if="props.title">{{ props.title }}</h1>
      <Skeleton v-else class="title-skeleton" />
    </slot>

    <div class="flex-vert gap-10">
      <slot name="date">
        <p v-if="props.date">
          開催日時:
          {{
            dateToLocal(props.date)
          }}
        </p>
        <Skeleton v-else class="date-skeleton" />
      </slot>

      <slot name="venue">
        <p v-if="props.venue">
          会場: {{ props.venue }}
        </p>
        <Skeleton v-else class="venue-skeleton" />
      </slot>
      <slot></slot>
    </div>

    <slot name="img">
      <template v-if="props.imageUrl">
        <Skeleton v-if="!isImageLoaded" class="img-skelton" :class="{ portrait: isPortrait }" />
        <img v-show="isImageLoaded" ref="imgRef" :src="props.imageUrl" :class="{ portrait: isPortrait }"
          @load="handleImageLoad" @error="handleImageError" alt="" />
      </template>
    </slot>
  </div>
</template>

<style scoped>
.title-skeleton {
  width: 70%;
  height: 2.5rem;
  border-radius: 10px;
}

.date-skeleton {
  width: 35%;
  height: 1.2rem;
  border-radius: 6px;
}

.venue-skeleton {
  width: 45%;
  height: 1.2rem;
  border-radius: 6px;
}

.img-skelton {
  width: 100%;
  height: 35svh;
  box-sizing: border-box;
  border-radius: 12px;
  align-self: center;
}

.img-skelton.portrait {
  height: 40vh;
  width: fit-content;
  align-self: center;
}

.note-header {
  padding: 30px 20px;
  border-radius: 20px;
  border: color-mix(in srgb, slateblue 60%, white 30%) solid;
  max-width: 800px;
  width: 100%;
  box-sizing: border-box;
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
  max-height: 40vh;
  width: auto;
  max-width: 100%;
  align-self: center;
  object-fit: contain;
}

@media (max-width: 800px) {
  .note-header {
    padding: 30px 20px;
    border-radius: 20px;
    border: color-mix(in srgb, slateblue 60%, white 30%) solid;
    max-width: 700px;
    width: 100%;
  }
}
</style>