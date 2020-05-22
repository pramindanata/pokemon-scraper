const fs = require('fs')
const pokemons = require('./data/pokemon.json')

const newPokemons = []
let prevPDIndex = null
let basePrevIndex = null
let sameIndexCount = 0

for (let i = 0; i < pokemons.length; i++) {
  const pokemon = pokemons[i]
  let stringIndex = null
  let name = pokemon.Name

  if (prevPDIndex !== pokemon['#']) {
    prevPDIndex = pokemon['#']
    basePrevIndex = null
    sameIndexCount = 0
    stringIndex = String(pokemon['#']).padStart(3, 0)
  } else {
    if (basePrevIndex === null) {
      basePrevIndex = i - 1
    }

    const prevPokemon = pokemons[basePrevIndex]
    sameIndexCount += 1
    stringIndex = `${String(pokemon['#']).padStart(3, 0)}_${sameIndexCount}`

    // Remove prefix name in Mega Pokemon.
    name = name.substr(prevPokemon.Name.length)
  }

  newPokemons.push({
    index: pokemon['#'],
    name,
    generation: pokemon.Generation,
    legendary: pokemon.Legendary === 'True',
    typeA: pokemon['Type 1'],
    typeB: pokemon['Type 2'] !== '' ? pokemon['Type 2'] : null,
    hp: pokemon.HP,
    attack: pokemon.Attack,
    def: pokemon.Defense,
    spAtt: pokemon['Sp. Atk'],
    spDef: pokemon['Sp. Def'],
    speed: pokemon.Speed,
    power: pokemon.Total,
    stringIndex,
  })
}

fs.writeFileSync('./src/data/pokemon-v2.json', JSON.stringify(newPokemons))
