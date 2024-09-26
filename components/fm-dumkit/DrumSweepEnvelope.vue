<script setup>
const props = defineProps({sweep : Object})
const emits = defineEmits(['update'])

const onChange = () => {
  emits("update", props.sweep)  
}


</script>

<template>
  <div class="flex-vert">
      <p>Pitch: {{ sweep.pitch }}</p>
      <input @change="onChange()" class="pitch-slider" type="range" min="0" max="8" step="1" v-model.number="sweep.pitch"></input>

      <p>A</p>
      <input @change="onChange()" class="slider" type="range" min="0.01" max="1" step="0.01" v-model.number="sweep.envelope.attack" >
    
      <p>D</p>
      <input @change="onChange()" class="slider" type="range" min="0.05" max="2" step="0.01" v-model.number="sweep.envelope.decay">
  </div>
</template>

<style scoped>
   .env{
    display: flex;
    flex-direction: column;
    border: 0;
    margin: 0;
  }
  input{
    color: black
  }

</style>