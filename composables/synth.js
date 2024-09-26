import * as Tone from 'tone'

export class SynthGen {
  constructor(id, destination, send) {
    this.id = id
    this.sequence = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.synth = new Tone.FMSynth({
      harmonicity: 1,
      modulationIndex: 200,
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.001,
        decay: 2,
        sustain: 1,
        release: 0.1
      },
      modulation: {
        type: 'sine'
      }
    })
    this.channel = new Tone.Volume(Tone.gainToDb(1))
    this.meter = new Tone.Meter()
    this.meter.normalRange = true
    this.note = 'F5'

    // freq envelope
    this.pitchEnv = new Tone.FrequencyEnvelope({
      baseFrequency: this.note,
      octaves: 2
    })

    // lowpass filter
    this.lpf = new Tone.Filter(100, 'lowpass', -24)
    this.lpf.Q.value = 3
    this.lpfScale = new Tone.Scale(1000, 50)
    this.lpfEnv = new Tone.Envelope()

    // highpass filter
    this.hpf = new Tone.Filter(100, 'highpass', -24)
    this.lpf.Q.value = 3
    this.hpfScale = new Tone.Scale(1000, 50)
    this.hpfEnv = new Tone.Envelope()

    // distortion
    this.dist = new Tone.Distortion(0)

    // reverbSend
    this.reverbSend = new Tone.Volume(Tone.gainToDb(0))

    //state
    this.isLpfEnabled = false
    this.isHpfEnabled = false

    // main patching
    /*
     synth -> hpf -> lpf -> dist -> channel -> master
                                 -> reverbSend -> send 
    */
    this.pitchEnv.connect(this.synth.modulation.frequency)
    this.pitchEnv.connect(this.synth.oscillator.frequency)
    this.synth.connect(this.hpf)
    this.hpf.connect(this.lpf)
    this.lpf.connect(this.dist)
    this.dist.fan(this.channel, this.reverbSend)
    this.reverbSend.connect(send)

    this.channel.fan(destination, this.meter)
  }
  //triggers
  trigger(start, length) {
    this.lpfEnv.triggerAttack(start)
    this.hpfEnv.triggerAttack(start)
    this.pitchEnv.triggerAttack(start)
    this.synth.triggerAttackRelease(this.note, length, start)
  }

  //patching
  filterPatching() {
    if (this.isLpfEnabled) {
      // osc -> lpf (env -> scale -> lpf freq)
      this.lpfEnv.connect(this.lpfScale)
      this.lpfScale.connect(this.lpf.frequency)
      this.lpf.Q.value = 3
    } else {
      this.lpfEnv.disconnect()
      this.lpfScale.disconnect()
      this.lpf.frequency.value = 20000
      this.lpf.Q.value = 0
    }
    if (this.isHpfEnabled) {
      // osc -> hpf (env -> scale -> hpf freq)
      this.hpfEnv.connect(this.hpfScale)
      this.hpfScale.connect(this.hpf.frequency)
      this.hpf.Q.value = 3
    } else {
      this.hpfEnv.disconnect()
      this.hpfScale.disconnect()
      this.hpf.frequency.value = 20
      this.hpf.Q.value = 0
    }
  }
  enableLpf() {
    this.isLpfEnabled = true
  }
  dissableLpf() {
    this.isLpfEnabled = false
  }

  enableHpf() {
    this.isHpfEnabled = true
  }
  dissableHpf() {
    this.isHpfEnabled = false
  }

  getSequence() {
    return this.sequence
  }

  getGain() {
    return Math.abs(this.meter.getValue())
  }

  //effect and gain
  setGain(value){
    const db = Tone.gainToDb(value)
    this.channel.set({
      volume: db
    })
  }

  setReverb(value){
    const db = Tone.gainToDb(value)
    this.reverbSend.set({
      volume: db
    })
  }

  setDistortion(value){
    this.dist.distortion = value
  }

  //fm synth access
  setNote(note) {
    this.note = note
    this.pitchEnv.set({
      baseFrequency: note
    })
  }

  setSequence(sequence) {
    this.sequence = sequence
  }

  setHarmonicity(value) {
    let unit = 1
    let scalar = 2
    let result = 1
    if (value < 0) {
      scalar = 2 * value
      result = unit / Math.abs(scalar)
    }
    if (value > 0) {
      scalar = 2 * value
      result = unit * scalar
    }
    this.synth.harmonicity.value = result
  }

  setModulationIndex(value) {
    this.synth.modulationIndex.value = value
  }

  setCarrierOsc(type) {
    this.synth.oscillator.type = type
  }

  setModulatorOsc(type) {
    this.synth.modulation.type = type
  }

  setEnvelope(a, d, s, r) {
    this.synth.envelope.attack = a
    this.synth.envelope.decay = d
    this.synth.envelope.sustain = s
    this.synth.envelope.release = r
  }

  setModulationEnvelope(a, d, s, r) {
    this.synth.set({
        modulationEnvelope: {
          attack: a,
          decay: d,
          sustain: s,
          release: r
        }
    })
  }

  setPitchEnvelope(a, d, s, r) {
    this.pitchEnv.set({
      attack: a,
      decay: d,
      sustain: s,
      release: r
    })
  }

  setPitchOctave(value) {
    this.pitchEnv.set({
      octaves: value
    })
  }

  // filter access

  setLpfEnvelope(a, d, s, r) {
    this.lpfEnv.set({
      attack: a,
      decay: d,
      sustain: s,
      release: r
    })
  }

  setHpfEnvelope(a, d, s, r) {
    this.hpfEnv.set({
      attack: a,
      decay: d,
      sustain: s,
      release: r
    })
  }

  setLpfRange(min, max) {
    this.lpfScale.set({
      min: min,
      max: max
    })
  }

  setHpfRange(min, max) {
    this.hpfScale.set({
      min: min,
      max: max
    })
  }
}
