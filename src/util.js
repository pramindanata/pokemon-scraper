/**
 * Return chunks of array
 *
 * @param {Array} arr
 * @param {number} chunkLimit
 * @param {Function} cb
 */
exports.chunk = async (arr, chunkLimit, cb) => {
  const iterateTotal = Math.ceil(arr.length / chunkLimit)
  // const max = 3

  for (let i = 0; i < iterateTotal; i++) {
    // if (i >= max) {
    //   break
    // }

    const start = i * chunkLimit
    const end = start + chunkLimit
    const chunks = arr.slice(start, end)

    await cb(chunks)
  }
}

exports.removeAssetOnReq = (page) => {
  page.setRequestInterception(true)
  page.on('request', (req) => {
    const type = req.resourceType()

    if (type === 'image' || type === 'stylesheet' || type === 'script') {
      return req.abort()
    }

    req.continue()
  })
}
