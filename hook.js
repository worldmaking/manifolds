// #!/usr/bin/env node
var lastCommitMessage = require('last-commit-message')

var hostname = require('hostname');
 


const hookcord = require('hookcord');

function discord(msg){

  payload = {
    content: msg
  }
  let Hook = new hookcord.Hook()
  .setLink("https://discordapp.com/api/webhooks/686587096458199233/vJCkAFhBpYrCfq2bwXMKlHQ2jVPz2wT1f-DQQg_RGCZoiD4Fl8K9qoA97pWMsyR23cnD")
  .setPayload(payload)
  .fire()
  .then(function(response) {})
  .catch(function(e) {})
}


 


 
lastCommitMessage().then(function (message) {
  console.log('latest message:', message)

  discord(hostname() + ' committed: ' + message)
                // Hook.send(msg);

})

