<script setup>
import DrumEnvelope from './DrumEnvelope.vue';
const props = defineProps({filterEnv: Object})
const emit = defineEmits(["update"])

function onChange() {
  emit("update", props.filterEnv)
}

</script>

<template>
    <div @change="onChange()" class="env">
      <div class="flex-vert">
        <p>cutoff</p>
        <input class="cutoff-slider" type="range" min="0" max="127" step="1" v-model.number="filterEnv.cutoff"></input>
      <DrumEnvelope :envelope="filterEnv.envelope" @update="e => filterEnv.envelope = e"></DrumEnvelope>
      </div>
    </div>
</template>

<style scoped>

.env{
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 20svw;
  height: fit-content;
  border: 0;
}
</style>