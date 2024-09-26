<script setup>
import * as Tone from 'tone'
import { SynthGen } from '~/composables/synth.js'
import KickKit from './KickKit.vue';
import SynthKit from './SynthKit.vue';
import SnareKit from './SnareKit.vue';

let synthEngine = []
let master
let reverb
let send

const isPlaying = ref(false)
const isToneInit = ref(false)
const kit1 = ref(initEngineKick())
const kit2 = ref(initEngineSnare())
const kit3 = ref(initEngineSynth())
const kit4 = ref(initEngineSynth())
const kit5 = ref(initEngineSynth())
const kit6 = ref(initEngineSynth())

onMounted(() => {
  master = new Tone.Channel(-3, 0)
  reverb = new Tone.Reverb(1)
  reverb.set({
    wet: 1
  })
  send = new Tone.Channel(0, 0)

  send.connect(reverb)
  master.toDestination()
  reverb.toDestination()

  for (let i = 0; i < 6; i++) {
    synthEngine.push(new SynthGen(i, master, send))
    synthEngine[i].enableLpf()
    synthEngine[i].enableHpf()
  }
})

onUnmounted(() => {
  Tone.getContext().close()
})

const counter = ref(0)
const page = ref(1)
const gainMeter = ref([0, 0, 0, 0, 0, 0])
const playStateClass = ref('pause')
const bpm = ref(120)

function startLoop() {
  new Tone.Loop((time) => {
    //sequence

    for (let i = 0; i < synthEngine.length; i++) {
      synthEngine[i].filterPatching()
      if (synthEngine[i].getSequence()[counter.value] == 1) {
        synthEngine[i].trigger(time, 1.5)
      }
      gainMeter.value[i] = synthEngine[i].getGain()
    }

    counter.value = counter.value == 15 ? 0 : counter.value + 1
  }, '16n').start(0)
}

function onChange() {
  mapValuesToDrum(kit1.value, synthEngine[0])
  mapValuesToDrum(kit2.value, synthEngine[1])
  mapValuesToSynth(kit3.value, synthEngine[2])
  mapValuesToSynth(kit4.value, synthEngine[3])
  mapValuesToSynth(kit5.value, synthEngine[4])
  mapValuesToSynth(kit6.value, synthEngine[5])
  console.log(synthEngine[0])
}

function setTempo(){
  Tone.getTransport().bpm.value = bpm.value
}

function playPause() {
  if (!isToneInit.value) {
    Tone.start()
    startLoop()
    isToneInit.value = true
  }
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    Tone.getTransport().start()
    playStateClass.value = 'playing'
  }
  if (!isPlaying.value) {
    Tone.getTransport().stop()
    playStateClass.value = 'pausing'
  }
}

function nextPage() {
  page.value = page.value == 6 ? page.value == 6 : page.value + 1
}

function prevPage() {
  page.value = page.value == 1 ? page.value == 1 : page.value - 1
}

function initEngineSynth() {
  return {
    sequences: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    channelSettings: {
      gain: 0.9,
      reverb: 0,
      distortion: 0
    },
    oscSettings: {
      freq: 'F1',
      harmonicity: 1,
      modulationIndex: 1,
      carOsc: 'sine',
      modOsc: 'sine'
    },
    ampEnv: {
      attack: 0.01,
      decay: 0.4,
      sustain: 0,
      release: 0.1
    },
    pitchEnv: {
      pitch: 4,
      envelope: {
        attack: 0.01,
        decay: 0.4,
        sustain: 0,
        release: 0.1
      }
    },
    lpfEnv: {
      cutoff: 30,
      envelope: {
        attack: 0.01,
        decay: 0.4,
        sustain: 0,
        release: 0.1
      }
    },
    hpfEnv: {
      cutoff: 30,
      envelope: {
        attack: 0.1,
        decay: 0.4,
        sustain: 0,
        release: 0.1
      }
    }
  }
}

function initEngineKick() {
  return {
    sequences: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    channelSettings: {
      gain: 0.9,
      reverb: 0,
      distortion: 0
    },
    oscSettings: {
      freq: 'F0',
      harmonicity: 1,
      modulationIndex: 13,
      carOsc: 'sine',
      modOsc: 'square'
    },
    ampEnv: {
      attack: 0.01,
      decay: 0.4,
      sustain: 0,
      release: 0.1
    },
    modEnv: {
      attack: 0.01,
      decay: 0,
      sustain: 1,
      release: 0.5
    },
    pitchEnv: {
      pitch: 4,
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    },
    lpfEnv: {
      cutoff: 100,
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.5,
        release: 0.1
      }
    },
    hpfEnv: {
      cutoff: 30,
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }
  }
}

function initEngineSnare() {
  return {
    sequences: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    channelSettings: {
      gain: 0.9,
      reverb: 0,
      distortion: 0.2
    },
    oscSettings: {
      freq: 'F1',
      harmonicity: 3,
      modulationIndex: 128,
      carOsc: 'square',
      modOsc: 'triangle'
    },
    ampEnv: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0,
      release: 0.1
    },
    modEnv: {
      attack: 0.01,
      decay: 2,
      sustain: 0,
      release: 0.5
    },
    pitchEnv: {
      pitch: 3,
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    },
    lpfEnv: {
      cutoff: 70,
      envelope: {
        attack: 0.01,
        decay: 0.8,
        sustain: 0.7,
        release: 0.1
      }
    },
    hpfEnv: {
      cutoff: 5,
      envelope: {
        attack: 0.01,
        decay: 0.45,
        sustain: 1,
        release: 0.1
      }
    }
  }
}

function mapValuesToSynth(e, synth) {
  synth.setGain(e.channelSettings.gain)
  synth.setReverb(e.channelSettings.reverb)
  synth.setDistortion(e.channelSettings.distortion)

  synth.setNote(e.oscSettings.freq)
  synth.setHarmonicity(e.oscSettings.harmonicity)
  synth.setModulationIndex(e.oscSettings.modulationIndex)
  synth.setCarrierOsc(e.oscSettings.carOsc)
  synth.setModulatorOsc(e.oscSettings.modOsc)

  synth.setEnvelope(e.ampEnv.attack, e.ampEnv.decay, e.ampEnv.sustain, e.ampEnv.release)

  synth.setPitchOctave(e.pitchEnv.pitch)
  synth.setPitchEnvelope(
    e.pitchEnv.envelope.attack,
    e.pitchEnv.envelope.decay,
    e.pitchEnv.envelope.sustain,
    e.pitchEnv.envelope.release
  )

  synth.setLpfRange(50, e.lpfEnv.cutoff * 100 + 50)
  synth.setLpfEnvelope(
    e.lpfEnv.envelope.attack,
    e.lpfEnv.envelope.decay,
    e.lpfEnv.envelope.sustain,
    e.lpfEnv.envelope.release
  )

  synth.setHpfRange(e.hpfEnv.cutoff * 20 + 20, 5000)
  synth.setHpfEnvelope(
    e.hpfEnv.envelope.attack,
    e.hpfEnv.envelope.decay,
    e.hpfEnv.envelope.sustain,
    e.hpfEnv.envelope.release
  )

  synth.setSequence(e.sequences)
}

function mapValuesToDrum(e, synth) {
  synth.setGain(e.channelSettings.gain)
  synth.setReverb(e.channelSettings.reverb)
  synth.setDistortion(e.channelSettings.distortion)

  synth.setNote(e.oscSettings.freq)
  synth.setHarmonicity(e.oscSettings.harmonicity)
  synth.setModulationIndex(e.oscSettings.modulationIndex)
  synth.setCarrierOsc(e.oscSettings.carOsc)
  synth.setModulatorOsc(e.oscSettings.modOsc)

  synth.setEnvelope(e.ampEnv.attack, e.ampEnv.decay, e.ampEnv.sustain, e.ampEnv.release)
  synth.setModulationEnvelope(e.modEnv.attack ,e.modEnv.decay ,e.modEnv.sustain ,e.modEnv.release)

  synth.setPitchOctave(e.pitchEnv.pitch)
  synth.setPitchEnvelope(
    e.pitchEnv.envelope.attack,
    e.pitchEnv.envelope.decay,
    e.pitchEnv.envelope.sustain,
    e.pitchEnv.envelope.release
  )

  synth.setLpfRange(50, e.lpfEnv.cutoff * 100 + 50)
  synth.setLpfEnvelope(
    e.lpfEnv.envelope.attack,
    e.lpfEnv.envelope.decay,
    e.lpfEnv.envelope.sustain,
    e.lpfEnv.envelope.release
  )

  synth.setHpfRange(20, e.hpfEnv.cutoff * 10 + 20)
  synth.setHpfEnvelope(
    e.hpfEnv.envelope.attack,
    e.hpfEnv.envelope.decay,
    e.hpfEnv.envelope.sustain,
    e.hpfEnv.envelope.release
  )

  synth.setSequence(e.sequences)
}
</script>

<template>
    <div class="">
      <div class="flex-vert gap-10 center">
        <div class="top-bar larger-container flex-vert gap-20">
          <div class="button-array">
            <div class="flex-hori gap-20">
              <button class="page-selector" @click="prevPage()">prev</button>
              <button class="page-selector" @click="nextPage()">next</button>
              <button :class="playStateClass" class="play-button" @click="playPause()">
                Play / Pause
              </button>
            </div>
          </div>
          <div class="flex-vert gap-10">
            <div v-if="!isToneInit">
              <div class="flex-hori gap-20">
                <div v-for="i in 6">
                  <div class="synth-gain" :style="`opacity: 0;`"></div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="flex-hori gap-20">
                <div v-for="i in 6">
                  <div
                    v-if="isPlaying"
                    class="synth-gain"
                    :style="`opacity: ${gainMeter[i - 1] * 8};`"
                  ></div>
                  <div v-else class="synth-gain" :style="`opacity: 0;`"></div>
                </div>
              </div>
            </div>
            <div class="flex-hori gap-20">
              <div v-for="i in 6">
                <div
                  class="synth-gain-current"
                  :style="`
                  background-color: ${i == page ? 'lightcoral' : 'palegoldenrod'};
                `"
                ></div>
              </div>
            </div>
            <div class="flex-hori gap-20">
              <span class="kit-name">BD</span>
              <span class="kit-name">SD</span>
              <span class="kit-name">MT</span>
              <span class="kit-name">PC</span>
              <span class="kit-name">SY</span>
              <span class="kit-name">SY</span>
            </div>
          </div>
          <div>
            <p>Tempo: {{ bpm }} BPM</p>
            <input @change="setTempo()" class="slider" type="range" min="50" max="200" step="10" v-model.number="bpm"></input>
          </div>
        </div>
        <div class="larger-container">
          <div class="synth-kit">
            <div v-if="page == 1">
              <KickKit :synth-state="kit1" @synth-kit-update="(e) => onChange()"></KickKit>
            </div>
            <div v-if="page == 2">
              <SnareKit :synth-state="kit2" @synth-kit-update="(e) => onChange()"></SnareKit>
            </div>
            <div v-if="page == 3">
              <SynthKit :synth-state="kit3" @synth-kit-update="(e) => onChange()"></SynthKit>
            </div>
            <div v-if="page == 4">
              <SynthKit :synth-state="kit4" @synth-kit-update="(e) => onChange()"></SynthKit>
            </div>
            <div v-if="page == 5">
              <SynthKit :synth-state="kit5" @synth-kit-update="(e) => onChange()"></SynthKit>
            </div>
            <div v-if="page == 6">
              <SynthKit :synth-state="kit6" @synth-kit-update="(e) => onChange()"></SynthKit>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
.page {
  top: 0%;
  left: 0%;
  width: 100svw;
  height: 100svh;
  position: absolute;
}

.button-array {
  padding: 10px;
}

.synth-kit {
  margin: 0 auto;
  left: 0%;
}

.synth-gain {
  width: 20px;
  height: 20px;
  background-color: indianred;
}

.kit-name {
  width: 20px;
}

.synth-gain-current {
  width: 20px;
  height: 5px;
  background-color: palegoldenrod;
}

.page-selector {
  appearance: none;
  border-radius: 20px;
  border-color: white;
  width: 20svw;
  max-width: 100px;
  padding: 20px;
  border: none;
}

.play-button {
  appearance: none;
  border-radius: 20px;
  border-color: white;
  width: 40svw;
  max-width: 200px;
  padding: 20px;
  border: none;
}

.pausing {
  background-color: white;
}

.playing {
  background-color: indianred;
}
</style>