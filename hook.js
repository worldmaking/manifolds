#!/usr/bin/env node
const { IncomingWebhook } = require('@slack/webhook');
const read = require('@commitlint/read');
var SlackWebhook = require('slack-webhook')

var slack = new SlackWebhook('https://hooks.slack.com/services/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', {
  defaults: {
    username: 'git',
    channel: '#precommit',
    icon_emoji: ':robot_face:'
  }
})  



read({edit: true})
    .then(messages => console.log(messages))
    .then(slack.send(messages))

// const url = process.env.SLACK_WEBHOOK_URL;
// //  const url = 'https://hooks.slack.com/services/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'
// const webhook = new IncomingWebhook(url);
//  let messages
// // Send the notification
// (async () => {
//   // Read last edited commit message
// read({edit: true})
//   .then(messages => send(messages))
//   .then(
//     webhook.send({
//       text: msg
//     })
//   )
// })(); 

// // function send(msg){
// //   console.log(msg)
// //   webhook.send({
// //     text: msg
// //   })
// // }