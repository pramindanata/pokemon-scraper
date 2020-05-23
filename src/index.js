;(async () => {
  console.log('# STARTING\n')

  console.log('# 1. Scrap Pokemon image URLs\n')

  const imgScraper = require('./img-scraper')
  await imgScraper()

  console.log('\n# 2. Download Pokemon images\n')

  const imgDownloader = require('./img-dl')
  await imgDownloader()

  console.log('\n# 3. Scrap Pokemon descriptions\n')

  const descScraper = require('./desc-scraper')
  await descScraper()

  console.log('\n# DONE')
})()
