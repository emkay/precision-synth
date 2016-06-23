const seedrandom = require('seedrandom')
const notes = require('./notes')
const noteStream = require('./note-stream')

function positive (n) {
  return n < 0 ? -n : n
}

const toPlay = []

setInterval(() => {
  function acceptableNumber (n) {
    if (n <= notes.length) return n - 1
    return acceptableNumber(Math.floor(n / 2))
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const total = position.coords.latitude + position.coords.longitude
    const rng = seedrandom(total, {entropy: true})
    const s = String(positive(rng()))
    const n = s.split('.')
      .join('')
      .split('')
      .reduce((a, b) => {
        return Number(a) + Number(b)
      })
    const note = notes[acceptableNumber(n)]
    console.log('note: ', note)
    noteStream.write(note)
  })
}, 500)
