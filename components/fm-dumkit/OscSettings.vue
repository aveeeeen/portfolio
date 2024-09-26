<script setup>
import {ref, defineEmits, defineProps} from 'vue'
const oscList = ["sine", "triangle", "sawtooth", "square"]
const freqList = ["F0","F1","F2","F3","F4","F5","F6","F7"]
const props = defineProps({oscSettings: Object})

const emit = defineEmits(["update"])

function onChange() {
  emit("update", props.oscSettings)
}
</script>

<template>
  <div @change="onChange()" class="container">
    <h2>Osc Settings</h2>
    <p>base freq: {{ oscSettings.freq }}</p>
    <select v-model="oscSettings.freq">
      <option v-for="f in freqList" :value="f">{{ f }}</option>
    </select>

    <p>carrier: {{ oscSettings.carOsc }}</p>
    <select v-model="oscSettings.carOsc">
      <option v-for="osc in oscList" :value="osc">{{ osc }}</option>
    </select>

    <p>modulator: {{ oscSettings.modOsc }}</p>
    <select v-model="oscSettings.modOsc">
      <option v-for="osc in oscList" :value="osc">{{ osc }}</option>
    </select>

    <p>harmonicity: {{ oscSettings.harmonicity }}</p>
    <input type="range" min="-8" max="24" v-model.number="oscSettings.harmonicity">

    <p>color: {{ oscSettings.modulationIndex }}</p>
    <input type="range" min="0" max="128" v-model.number="oscSettings.modulationIndex">

  </div>
</template>