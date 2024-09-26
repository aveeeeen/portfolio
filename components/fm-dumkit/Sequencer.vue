<script setup>
import {reactive, defineEmits, defineProps, watch, watchEffect} from 'vue'

const props = defineProps({sequences: Array})
const emit = defineEmits(["update"])

function onClick(e, i){
  sequencer.updateSequence(e, i)
  emit("update", props.sequences)
}
</script>

<template>
  <div class="container">
    <h2>Sequencer</h2>
    <div class="flex-vert center">
      <div class="sequencer">
        <div v-for="i in 16">
          <span :style="`background-color: ${sequences[i - 1] == 1 ? 'indianred' : 'white'}`" @click="sequences[i - 1] == 1 ? sequences[i - 1] = 0 : sequences[i - 1] = 1" class="sequencer-step center"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.sequencer {
  display: grid;
  grid-template-columns: repeat(4, 2.5rem);
  grid-template-rows: repeat(4, 2.5rem);
  justify-items: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
}

.sequencer-step {
  display: flex;
  width: 2rem;
  height: 2rem;
  background-color: white;
  z-index: 1;
}
</style>
