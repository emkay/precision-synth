const Octavian = require('octavian')
const notes = require('./notes')
const context = require('./audio-context')

function positive (n) {
  return n < 0 ? -n : n
}

const toPlay = []

setInterval(() => {
  function acceptableNumber (n) {
    if (n <= 24) return n - 1
    return acceptableNumber(Math.floor(n / 2))
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const total = position.coords.latitude + position.coords.longitude
    const s = String(positive(total))
    const n = s.split('.')
      .join('')
      .split('')
      .reduce((a, b) => {
        return Number(a) + Number(b)
      })

    toPlay.push(acceptableNumber(n))
  })
}, 500)

setInterval(() => {
  if (!toPlay || toPlay.length === 0) return
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const volume = gain.gain

  function play (freq) {
    console.log(freq)
    oscillator.frequency.value = freq
    volume.value = 1
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(0)
  }

  function pause () {
    volume.value = 0
  }

  const note = notes[toPlay.pop()]
  const frequency = new Octavian.Note(note).frequency

  pause()
  play(frequency)
}, 500)
