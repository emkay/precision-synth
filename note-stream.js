const Writable = require('stream').Writable
const Octavian = require('octavian')
const context = require('./audio-context')

const noteStream = Writable({objectMode: true})
noteStream._write = (n, enc, next) => {
  const no = [n.scale, n.octave].join('')
  const oNote = new Octavian.Note(no)
  console.log('oNote:', oNote)
  console.log('interval: ', n.interval)
  const note = n.interval !== '' ? oNote[n.interval]() : oNote
  console.log('note: ', note)
  const chord = n.isChord ? note.toChord(n.chordType) : false
  console.log('chord: ', chord)

  if (chord) {
    chord.frequencies.forEach((freq) => {
      playFreq(freq, n.instrumentType)
      if (n.secondInstrumentType) playFreq(freq, n.secondInstrumentType)
      if (n.thirdInstrumentType) playFreq(freq, n.thirdInstrumentType)
    })
  } else {
    playFreq(note.frequency, n.instrumentType)
    if (n.secondInstrumentType) playFreq(note.frequency, n.secondInstrumentType)
    if (n.thirdInstrumentType) playFreq(note.frequency, n.thirdInstrumentType)
  }

  next()
}

function playFreq (frequency, instrument) {
  const oscillator = context.createOscillator()
  // const biquadFilter = context.createBiquadFilter()
  const gain = context.createGain()
  const volume = gain.gain

  function play (freq) {
    oscillator.frequency.value = freq
    oscillator.type = instrument
    volume.value = 1
    oscillator.connect(gain)
    // biquadFilter.connect(gain)
    gain.connect(context.destination)
    oscillator.start()

    // biquadFilter.type = 'lowshelf'
    // biquadFilter.frequency.value = 1000
    // biquadFilter.gain.value = 25
  }

  function pause () {
    oscillator.stop()
  }

  play(frequency)
  setTimeout(pause, 500)
}

module.exports = noteStream
