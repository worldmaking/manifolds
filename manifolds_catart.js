const max = require('max-api')
const ws = require('ws')

const ReconnectingWebSocket = require('reconnecting-websocket')
 
let corpus = {
  analysis: {
    progress: null
  },
  buffers: []
}

const options = {
  WebSocket: ws, // custom WebSocket constructor
  connectionTimeout: 1000,
  maxRetries: 1000,
};
const rws = new ReconnectingWebSocket('ws://localhost:8080', [], options);

// const rws = new ReconnectingWebSocket('ws://localhost:8080');
 
rws.addEventListener('open', () => {
    // rws.send('hello!');
});


rws.addEventListener('message', (message) => {
  // rws.send('hello!');
  let msg = JSON.parse(message.data)
  max.post(msg)
  switch (msg.cmd){

    case 'mouseState':
      // max.post(message.data)
      max.outlet('mouseRange', msg.data.width, msg.data.height)

      max.outlet('mouseState', msg.data.mouseX, msg.data.mouseY)

    break

    default:
  }

});

max.addHandler('analysisProgress', (percent) =>{
  corpus.analysis.progress = percent
  if (percent === 100. || percent === 100){
    rws.send(JSON.stringify({
      cmd: 'corpus',
      data: corpus
    }))
  }
})

max.addHandler('buffers', (bufferNumber) =>{
  nums = bufferNumber.split(' ')
  for(i = 0; i < nums.length; i++){
  corpus.buffers.push({
    Duration: [],
    FrequencyMean: [],
    EnergyMean: [],
    PeriodicityMean: [],
    AC1Mean: [],
    LoudnessMean: [],
    CentroidMean: [],
    SpreadMean: [],
    SkewnessMean: [],
    KurtosisMean: [],
  }) 
  max.post(corpus)
    max.outlet('gettracks', nums[i])
  }
  
})

max.addHandler('tracks', (buffer, tracks)=>{
  max.post(buffer, tracks)
})

// max.addHandler('matrixcolnames', (names)=>{
//   columns = names.split(' ')
//   for(i = 0; i < columns.length; i++){
//   corpus.buffers[nums[i]] = {
//     audio: null,
//     descr
//   }
//     max.outlet('gettracks', nums[i])
//   }
//   max.post(corpus)
// })

max.addHandler('descriptors', (buffer, descriptor, value)=>{
  buf = (buffer - 1)
  corpus.buffers[buf][descriptor].push(value)
})

max.addHandler('view', ()=>{
  max.outlet('corpus', corpus)
})


max.addHandler('prepareCorpus', ()=>{
  parseCorpus()
})
let corpus = {}
corpus.buffers = []

function parseCorpus(){
  let inputCorpus = JSON.parse(fs.readFileSync('descr.json'))
  
  matrixColumns = inputCorpus.tracks[0].mxColNames

  let unfilteredData = inputCorpus.tracks[0].buffers[0].mxData
  let chunkSize = matrixColumns.length

  // get columns
  for (i = 0; i < chunkSize; i++){
    corpus[matrixColumns[i]] = []
  }

  // I'm certain that an array map would be better than what I did here: 
  while (unfilteredData.length) {
    let chunk = unfilteredData.splice(0, chunkSize)
    corpus.buffsers.push([matrixColumns[0]].push(chunk[0]))
    corpus[matrixColumns[1]].push(chunk[1])
    corpus[matrixColumns[2]].push(chunk[2])
    corpus[matrixColumns[3]].push(chunk[3])
    corpus[matrixColumns[4]].push(chunk[4])
    corpus[matrixColumns[5]].push(chunk[5])
    corpus[matrixColumns[6]].push(chunk[6])
    corpus[matrixColumns[7]].push(chunk[7])
    corpus[matrixColumns[8]].push(chunk[8])
    corpus[matrixColumns[9]].push(chunk[9])
  }

  max.outlet('corpus', corpus)

}

