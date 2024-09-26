<script setup>
const props = defineProps({channelSettings: Object})
const emit = defineEmits(["update"])

function onChange(){
  emit('update', props.channelSettings)
}

</script>

<template>
  <div class="container">
    <h2>Channel</h2>
    <p>Gain</p>
    <input @change="onChange()" class="slider" type="range" min="0" max="1" step="0.01" v-model.number="channelSettings.gain"></input>
    <p>Dist</p>
    <input @change="onChange()" class="slider" type="range" min="0" max="1" step="0.01" v-model.number="channelSettings.distortion"></input>
    <p>Reverb</p>
    <input @change="onChange()" class="slider" type="range" min="0" max="1" step="0.01" v-model.number="channelSettings.reverb"></input>
  </div>
</template>