const Writable = require('stream').Writable
const Octavian = require('octavian')
const context = require('./audio-context')

const noteStream = Writable()
noteStream._write = (n, enc, next) => {
  n = n.toString()
  const splat = n.split(':')
  const note = new Octavian.Note(splat[0])
  const mm = splat[1] === 1 ? 'major' : 'minor'
  const chord = note.toChord(mm)

  console.log('chord: ', chord.signatures)
  chord.frequencies.forEach((frequency) => {
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
  })
  next()
}

module.exports = noteStream
