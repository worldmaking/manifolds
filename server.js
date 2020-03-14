const WebSocket = require('ws');
const express = require('express');
const app = express();

// list of users
let CLIENTS=[];
let id = 0;

const wss = new WebSocket.Server({ port: 8080 });
 
wss.on('connection', function connection(ws) {

    id++
    console.log('connection is established : ' + id);
    CLIENTS[id] = ws;
    CLIENTS.push(ws);


  ws.on('message', function incoming(message) {

    msg = JSON.parse(message)

    switch(msg.cmd){

      case 'mouseState':
        console.log('mouse position: ', msg.data)
        wss.broadcast(message);
      break
      default: console.log('cmd not provided in message: ', message)
    }
    
  });
 
});

app.use(express.static('webClient'));

app.get('/', (req, res) => {
    res.send('An alligator approaches!');
});


app.listen(3000, () => console.log('Gator app listening on port 3000!'));

wss.broadcast = function broadcast(msg) {
  // console.log(msg);
  wss.clients.forEach(function each(client) {
      client.send(msg);
   });
};