const WebSocket = require('ws');
const express = require('express');
const app = express();


const wss = new WebSocket.Server({ port: 8080 });
 
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
 
  ws.send('something');
});

app.use(express.static('webClient'));

app.get('/', (req, res) => {
    res.send('An alligator approaches!');
});


app.listen(3000, () => console.log('Gator app listening on port 3000!'));