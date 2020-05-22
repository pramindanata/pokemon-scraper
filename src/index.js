const imgScraper = require('./img-scraper')
const imgDownloader = require('./img-dl')
const descScraper = require('./desc-scraper')

;(async () => {
  console.log('# STARTING\n')

  console.log('# 1. Scrap Pokemon image URLs\n')

  await imgScraper()

  console.log('\n# 2. Download Pokemon images\n')

  await imgDownloader()

  console.log('\n# 3. Scrap Pokemon descriptions\n')

  await descScraper()

  console.log('\n# DONE')
})()
