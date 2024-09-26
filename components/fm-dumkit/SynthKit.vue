<script setup>
import { ref, watch, defineEmits, defineProps, onMounted } from "vue"
import * as Tone from "tone"
import Sequencer from './Sequencer.vue';
import Envelope from "./Envelope.vue";
import FilterEnvelope from "./FilterEnvelope.vue";
import OscSettings from "./OscSettings.vue";
import ChannelSettings from "./ChannelSettings.vue";

const props = defineProps({ synthState: { requred: true, type: Object } })

onMounted(() => {
  console.log(props.synthState)
})

const emit = defineEmits(["synth-kit-update"])

function onChange() {
  emit("synth-kit-update", props.synthState)
}

</script>
<template>
  <div class="center">
    <div @click="onChange()" @change="onChange()" class="synth-kit">
      <ChannelSettings :channel-settings="synthState.channelSettings"
        @update="event => synthState.channelSettings = event"></ChannelSettings>

      <Sequencer :sequences="synthState.sequences" @update="event => synthState.sequences = event"></Sequencer>

      <OscSettings :osc-settings="synthState.oscSettings" @update="event => synthState.oscSettings = event">
      </OscSettings>

      <div class="container">
        <h2>Amp</h2>
        <Envelope :envelope="synthState.ampEnv" @update="event => synthState.ampEnv = event"></Envelope>
      </div>

      <div class="container">
        <h2>Pitch</h2>
        <div class="flex-vert">
          <p>pitch: {{ synthState.pitchEnv.pitch }}</p>
          <input class="pitch-slider" type="range" min="0" max="8" step="1"
            v-model.number="synthState.pitchEnv.pitch"></input>
          <Envelope :envelope="synthState.pitchEnv.envelope" @update="event => synthState.pitchEnv.envelope = event">
          </Envelope>
        </div>
      </div>

      <div class="container">
        <h2>lpf</h2>
        <FilterEnvelope :filter-env="synthState.lpfEnv" @update="event => synthState.lpfEnv = event"></FilterEnvelope>
      </div>

      <div class="container">
        <h2>hpf</h2>
        <FilterEnvelope :filter-env="synthState.hpfEnv" @update="event => synthState.hpfEnv = event"></FilterEnvelope>
      </div>
    </div>
  </div>

</template>

<style scoped>
.synth-kit {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-template-rows: repeat(auto, 200px);
  gap: 10px;
  margin: 0%;
  align-items: center;
  justify-content: center;
}
</style>