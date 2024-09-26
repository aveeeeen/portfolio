<script setup>
import {ref, watch, defineEmits, defineProps, onMounted } from "vue"
import * as Tone from "tone"
import Sequencer from './Sequencer.vue';
import Envelope from "./Envelope.vue";
import KickSettings from "./KickSettings.vue";
import DrumSweepEnvelope from "./DrumSweepEnvelope.vue";
import DrumFilterEnvelope from "./DrumFilterEnvelope.vue";
import DrumEnvelope from "./DrumEnvelope.vue";
import ChannelSettings from "./ChannelSettings.vue";

const props = defineProps({synthState: {requred: true, type: Object}})

onMounted(() => {
  console.log(props.synthState)
})

const emit = defineEmits(["synth-kit-update"])

function onChange(){
  emit("synth-kit-update", props.synthState)
}

function mapContourToSynth(input, destination){
  destination.modEnv.decay = input
  destination.modEnv.sustain = 1 - input / 2
}

function mapSweepToSynth(input, destination){
  destination.pitch = input.pitch
  destination.pitchEnv = input.envelope.attack
  destination.pitchEnv = input.envelope.decay
}

</script>
<template>
  <div class="center">
    <div @click="onChange()" @change="onChange()" class="synth-kit">
      <ChannelSettings :channel-settings="synthState.channelSettings" @update="event => synthState.channelSettings = event"></ChannelSettings>

      <Sequencer :sequences="synthState.sequences" @update="event => synthState.sequences = event"></Sequencer>
      
      <KickSettings :osc-settings="synthState.oscSettings" @update="event => synthState.oscSettings = event"></KickSettings>

      <div class="container">
        <h2>Decay / Sustain</h2>
        <div class="flex-vert">
          <DrumEnvelope
           :envelope="synthState.ampEnv" 
           @update-envelope="event => synthState.ampEnv = event"
          ></DrumEnvelope>
            <p>Contour</p>
            <input @change="mapContourToSynth(synthState.modEnv.decay, synthState)" class="pitch-slider" type="range" min="0" max="2" step="0.01" v-model.number="synthState.modEnv.decay">
        </div>
      </div>

      <div class="container">
        <h2>Sweep</h2>
        <DrumSweepEnvelope 
          :sweep="synthState.pitchEnv" 
          @update="event => synthState.pitchEnv = event"
        ></DrumSweepEnvelope>
      </div>

      <div class="container">
        <h2>lpf</h2>
        <DrumFilterEnvelope :filter-env="synthState.lpfEnv" @update="event => synthState.lpfEnv = event"></DrumFilterEnvelope> 
      </div>

      <div class="container">
        <h2>hpf</h2>
        <DrumFilterEnvelope :filter-env="synthState.hpfEnv" @update="event => synthState.hpfEnv = event"></DrumFilterEnvelope> 
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.synth-kit{
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-template-rows: repeat(auto, 200px);
  gap: 10px;
  margin: 0%;
  align-items: center;
  justify-content: center;
}
</style>