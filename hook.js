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



// const { IncomingWebhook } = require('@slack/webhook');
// const read = require('@commitlint/read');
// var SlackWebhook = require('slack-webhook')

// var slack = new SlackWebhook('https://hooks.slack.com/services/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', {
//   defaults: {
//     username: 'git',
//     channel: '#precommit',
//     icon_emoji: ':robot_face:'
//   }
// })  

// const promise = Promise.resolve(read({edit: true}));

// // console.log(promise)
// promise.then(value => {
//   console.log(value); // 42
//   console.log(promise)
//   let msg = value

//   slack.send(msg).then(function (res) {
//     // succesful request
//     // console.log(res)
//   }).catch(function (err) {
//     // handle request error
//   })
// });

// // .then(messages => slack.send(messages))


//     // .then()

// // const url = process.env.SLACK_WEBHOOK_URL;
// // //  const url = 'https://hooks.slack.com/services/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'
// // const webhook = new IncomingWebhook(url);
// //  let messages
// // // Send the notification
// // (async () => {
// //   // Read last edited commit message
// // read({edit: true})
// //   .then(messages => send(messages))
// //   .then(
// //     webhook.send({
// //       text: msg
// //     })
// //   )
// // })(); 

// // // function send(msg){
// // //   console.log(msg)
// // //   webhook.send({
// // //     text: msg
// // //   })
// // // }