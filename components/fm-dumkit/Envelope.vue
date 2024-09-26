<script setup>
const props = defineProps({envelope : Object})
const emits = defineEmits(['update'])

const onChange = () => {
  emits("update", props.envelope)  
}


</script>

<template>
  <div class="flex-vert">
      <p>A</p>
      <input @change="onChange()" class="slider" type="range" min="0.01" max="1" step="0.01" v-model.number="envelope.attack" >
    
      <p>D</p>
      <input @change="onChange()" class="slider" type="range" min="0.05" max="2" step="0.01" v-model.number="envelope.decay">

      <p>S</p>
      <input @change="onChange()" class="slider" type="range" min="0" max="1" step="0.1" v-model.number="envelope.sustain">

      <p>R</p>
      <input @change="onChange()" class="slider" type="range" min="0.01" max="2" step="0.01" v-model.number="envelope.release">
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