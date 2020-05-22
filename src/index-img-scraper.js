const puppeteer = require('puppeteer')
const cli = require('cli-progress')
const fs = require('fs')
const path = require('path')

const config = require('./config')
const util = require('./util')
const pokemons = require('./data/pokemon-v2.json')

const imageBaseUrl = 'https://id.portal-pokemon.com/play/pokedex'

async function main() {
  const result = []
  const browser = await puppeteer.launch({
    headless: true,
  })
  const maxPage = 5

  // Setup CLI Bar
  const bar = new cli.SingleBar(
    {
      format: 'Progress [{bar}] {percentage}% | {value}/{total}',
    },
    cli.Presets.rect,
  )

  // Generate pages
  await Promise.all(Array.from(Array(maxPage - 1)).map(() => browser.newPage()))

  const pages = await browser.pages()

  // Set interceptor
  await Promise.all(
    pages.map((page) => {
      page.setRequestInterception(true)
      page.on('request', (req) => {
        const type = req.resourceType()

        if (type === 'image' || type === 'stylesheet' || type === 'script') {
          return req.abort()
        }

        req.continue()
      })
    }),
  )

  // Start bar
  console.log('Fetching images url...')
  bar.start(pokemons.length, 0)

  // Explore
  const errors = []

  await util.chunk(pokemons, maxPage, async (chunks) => {
    const ready = chunks.length

    // Open all pages in parallel
    await Promise.all(
      pages
        .slice(0, ready)
        .map((page, i) =>
          page.goto(`${imageBaseUrl}/${chunks[i].stringIndex}`),
        ),
    )

    for (let i = 0; i < ready; i++) {
      const pokemon = chunks[i]
      const page = await pages[i]

      try {
        const imgUrl = await page.$$eval('.pokemon-img__front', (s) => s[0].src)

        result.push({
          index: pokemon.stringIndex,
          url: imgUrl,
        })
      } catch (err) {
        errors.push(pokemon.stringIndex)
      }

      bar.increment()
    }
  })

  // Save
  bar.stop()

  if (errors.length > 0) {
    console.log(
      'Found error in',
      errors.map((index) => `#${index}`),
    )
  }

  const pathname = '/dump/json/images.json'

  await fs.promises.writeFile(
    path.join(config.basePath, pathname),
    JSON.stringify(result),
  )

  console.log(`Fetching done. Saved in ${pathname}`)

  await browser.close()
}

main().catch((err) => console.log(err))
