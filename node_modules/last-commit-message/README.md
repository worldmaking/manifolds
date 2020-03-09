# last-commit-message

Get the latest commit message in a git repository.

[Install](#install) - [Usage](#usage) - [License: Apache-2.0](#license)

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/last-commit-message.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/last-commit-message
[travis-image]: https://img.shields.io/travis/com/goto-bus-stop/last-commit-message/master.svg?style=flat-square
[travis-url]: https://travis-ci.com/goto-bus-stop/last-commit-message
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

```
npm install last-commit-message
```

## Usage

```js
var lastCommitMessage = require('last-commit-message')

lastCommitMessage().then(function (message) {
  console.log('latest message:', message)
})

lastCommitMessage({ cwd: '/path/to/repo' }).then(function (message) {
  console.log('latest message:', message)
})
```

## API

### `lastCommitMessage(opts={})`

Returns a Promise for the most recent commit message as a string.

Specify `opts.cwd` to check for the message in a specific repository.

If the repository does not contain any commits, the Promise rejects with an error `error.message === 'Empty repository'`.

## License

[Apache-2.0](LICENSE.md)
