/**
 * Return chunks of array
 *
 * @param {Array} arr
 * @param {number} chunkLimit
 * @param {Function} cb
 */
exports.chunk = async (arr, chunkLimit, cb) => {
  const iterateTotal = Math.ceil(arr.length / chunkLimit)

  for (let i = 0; i < iterateTotal; i++) {
    const start = i * 5
    const end = start + chunkLimit
    const chunks = arr.slice(start, end)

    await cb(chunks)
  }
}
