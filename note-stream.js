const Writable = require('stream').Writable
const Octavian = require('octavian')
const context = require('./audio-context')

const noteStream = Writable()
noteStream._write = (note, enc, next) => {
  note = note.toString()

  const frequency = new Octavian.Note(note).frequency

  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const volume = gain.gain

  function play (freq) {
    oscillator.frequency.value = freq
    volume.value = 1
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(0)
  }

  function pause () {
    volume.value = 0
  }

  play(frequency)
  setTimeout(pause, 500)
  next()
}

module.exports = noteStream
