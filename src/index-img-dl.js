const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const cli = require('cli-progress')
const { pipeline } = require('stream')
const { promisify } = require('util')

const util = require('./util')
const config = require('./config')
const pokemons = require('./data/pokemon.json')
const images = require('../dump/json/images.json')

const streamPipeline = promisify(pipeline)

async function main() {
  const maxDownload = 10
  const bar = new cli.SingleBar(
    {
      format: 'Progress [{bar}] {percentage}% | {value}/{total}',
    },
    cli.Presets.rect,
  )

  // Start
  console.log('[x] Downloading images...')
  bar.start(images.length, 0)

  await util.chunk(images, maxDownload, async (chunks) => {
    await Promise.all(
      chunks.map(async (pokemon) => {
        const res = await fetch(pokemon.url)
        const filepath = path.join(
          config.basePath,
          `/dump/image/${pokemon.index}.png`,
        )

        // Save file
        await streamPipeline(res.body, fs.createWriteStream(filepath))

        bar.increment()
      }),
    )
  })

  // Finish downloading
  bar.stop()
  console.log(
    `[x] Downloading done. All images saved in "${path.join(
      config.basePath,
      '/dump/image',
    )}".`,
  )

  // Compose image dict
  console.log('[x] Creating new Pokemon JSON file.')

  const newPokemonPath = path.join(
    config.basePath,
    '/dump/json/pokemon-with-img.json',
  )
  const newPokemons = pokemons.map((p) => ({
    ...p,
    image: `${p.stringIndex}.png`,
  }))

  await fs.promises.writeFile(newPokemonPath, JSON.stringify(newPokemons))

  console.log(`[x] Pokemon JSON file created, saved in "${newPokemonPath}".`)
}

main().catch((err) => {
  console.log(err)
})
