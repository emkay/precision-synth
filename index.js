const seedrandom = require('seedrandom')
const noteStream = require('./note-stream')

function isEven (n) {
  return n % 2 === 0
}

function positive (n) {
  return isPositive(n) ? n : -n
}

function isPositive (n) {
  return n > 0
}

function acceptableNumber (n, max) {
  if (n <= max) return n === 0 ? n : positive(n - 1)
  return acceptableNumber(Math.floor(n / 2), max)
}

function getScale (n) {
  const scales = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  const rng = seedrandom(n)
  const digit = String(rng().toFixed(1)).split('.')[1]
  const r = acceptableNumber(positive(digit), 7)
  return [scales[r], getModifier(r)].join('')
}

function getModifier (n) {
  const modifiers = ['', '#', 'b', '']
  return modifiers[acceptableNumber(n, 2)]
}

function getInterval (n) {
  const intervals = [
    '',
    'minorSecond',
    'majorSecond',
    'minorThird',
    'diminishedFifth',
    'perfectOctave',
    'majorSeventh',
    'minorSeventh',
    'perfectFifth'
  ]
  const rng = seedrandom(n)
  const i = String(rng().toFixed(1)).split('.')[1]
  return intervals[acceptableNumber(i, 9)]
}

function getOctave (n) {
  const octaves = [2, 3, 4, 5, 6]
  const rng = seedrandom(n, {entropy: true})
  const i = String(rng().toFixed(1)).split('.')[1]
  return octaves[acceptableNumber(i, 5)]
}

function getInstrument (n) {
  const instruments = ['triangle', 'square', 'sine', 'sawtooth']
  const rng = seedrandom(n)
  const i = String(rng().toFixed(1)).split('.')[1]
  return instruments[acceptableNumber(i, 4)]
}

setInterval(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    const isLatPositive = isPositive(lat)
    const isLonPositive = isPositive(lon)
    const latSplit = String(positive(lat)).split('.')
    const lonSplit = String(positive(lon)).split('.')
    const latDigits = latSplit[1].split('')
    const lonDigits = lonSplit[1].split('')
    const rng = seedrandom(positive(lat + lon), {entropy: true})

    const scale = getScale(latSplit[0])
    const interval = getInterval(latDigits[0])
    const octave = getOctave(lonDigits[0])
    const isChord = isEven(String(rng()).split('.')[1])
    const chordType = isLatPositive ? 'major' : 'minor'
    const secondChordType = isLonPositive ? 'major' : 'minor'
    const instrumentType = getInstrument(latDigits[5])
    const secondInstrumentType = getInstrument(lonDigits[6])
    const thirdInstrumentType = getInstrument(latDigits[7])

    /*
    console.log('scale: ', scale)
    console.log('interval: ', interval)
    console.log('octave: ', octave)
    console.log('isChord: ', isChord)
    console.log('instrumentType: ', instrumentType)
    console.log('secondInstrumentType: ', secondInstrumentType)
   */
    const note = {
      scale,
      interval,
      octave,
      isChord,
      chordType,
      secondChordType,
      instrumentType,
      secondInstrumentType,
      thirdInstrumentType
    }

    noteStream.write(note)
  })
}, 500)
