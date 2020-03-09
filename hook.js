#!/usr/bin/env node
const { IncomingWebhook } = require('@slack/webhook');
// const url = process.env.SLACK_WEBHOOK_URL;
 const url = 'https://hooks.slack.com/services/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'
const webhook = new IncomingWebhook(url);
 
// Send the notification
(async () => {
  await webhook.send({
    text: 'I\'ve got news for you...',
  });
})(); 