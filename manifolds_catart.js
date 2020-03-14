const max = require('max-api')
const ws = require('ws')

const ReconnectingWebSocket = require('reconnecting-websocket')
 
 
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