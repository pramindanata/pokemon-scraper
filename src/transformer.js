const fs = require('fs')
const pokemons = require('./data/old-pokemon.json')

const newPokemons = []
let prevPDIndex = null
let basePrevIndex = null
let sameIndexCount = 0

for (let i = 0; i < pokemons.length; i++) {
  const pokemon = pokemons[i]
  let stringIndex = null

  if (prevPDIndex !== pokemon['#']) {
    prevPDIndex = pokemon['#']
    basePrevIndex = null
    sameIndexCount = 0
    stringIndex = String(pokemon['#']).padStart(3, 0)
  } else {
    if (basePrevIndex === null) {
      basePrevIndex = i - 1
    }

    sameIndexCount += 1
    stringIndex = `${String(pokemon['#']).padStart(3, 0)}_${sameIndexCount}`
  }

  newPokemons.push({
    index: pokemon['#'],
    name: pokemon.Name,
    generation: pokemon.Generation,
    legendary: pokemon.Legendary === 'TRUE',
    typeA: pokemon['Type 1'],
    typeB: pokemon['Type 2'] !== '' ? pokemon['Type 2'] : null,
    hp: pokemon.HP,
    attack: pokemon.Attack,
    defend: pokemon.Defense,
    spAttack: pokemon['Sp. Atk'],
    spDefend: pokemon['Sp. Def'],
    speed: pokemon.Speed,
    power: pokemon.Total,
    stringIndex,
  })
}

fs.writeFileSync('./src/data/pokemon.json', JSON.stringify(newPokemons))
