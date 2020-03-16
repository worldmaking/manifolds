const fs = require('fs')

let inputCorpus = JSON.parse(fs.readFileSync('descr.json'))
let corpus = {}
matrixColumns = inputCorpus.tracks[0].mxColNames

let unfilteredData = inputCorpus.tracks[0].buffers[0].mxData
// console.log(unfilteredData)
// console.log(matrixColumns)
let chunkSize = matrixColumns.length

for (i = 0; i < chunkSize; i++){
  corpus[matrixColumns[i]] = []
}

// for (i = 0; i < chunkSize; i++){
while (unfilteredData.length) {
  let chunk = unfilteredData.splice(0, chunkSize)
  corpus[matrixColumns[0]].push(chunk[0])
  corpus[matrixColumns[1]].push(chunk[1])
  corpus[matrixColumns[2]].push(chunk[2])
  corpus[matrixColumns[3]].push(chunk[3])
  corpus[matrixColumns[4]].push(chunk[4])
  corpus[matrixColumns[5]].push(chunk[5])
  corpus[matrixColumns[6]].push(chunk[6])
  corpus[matrixColumns[7]].push(chunk[7])
  corpus[matrixColumns[8]].push(chunk[8])
  corpus[matrixColumns[9]].push(chunk[9])
  // console.log(i)
  // console.log(matrixColumns[i], chunk[i])
    // results.push(unfilteredData.splice(0, chunk_size));
}
  // console.log(i)
// }s
console.log(corpus)
