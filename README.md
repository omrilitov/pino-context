# pino-context
A tool to give some context to your logs.

## Installation
```bash
$ [sudo] npm install pino-context async-local-storage
```

## Usage

### Examples
#### Express
``` js
const express = require('express');
const logger = require('pino-context')();
const {addContext} = require('pino-context');
const als = require('async-local-storage');
const app = express();

als.enable();

app.use((req, res, next) => {
  als.scope();
  addContext('requestId', 'unique identifier'); // Generate some unique identifier
  next();
});

app.use((req, res, next) => {
  logger.info('This is a log');
  addContext('url', req.url);
  next();
});

app.get('/', (req, res) => {
  logger.info('This is another log');
  res.send(`Hello World`);
});

app.listen(1337, () => {
  logger.info('Listening');
});
```

Will output
``` js
{"level":30,"time":1551190582956,"msg":"Listening","pid":13031,"context":{},"v":1}
{"level":30,"time":1551190586342,"msg":"This is a log","pid":13031,"context":{"requestId":"unique identifier"},"v":1}
{"level":30,"time":1551190586342,"msg":"This is another log","pid":13031,"context":{"url":"/","requestId":"unique identifier"},"v":1}
```

#### Using with existing pino instance

``` js
const instance = require('pino')();
const logger = require('pino-context')(instance);

logger.info('Will use the previous instance');
```

## Related

- [pino](https://github.com/pinojs/pino) - A Node.js logger, inspired by Bunyan.
- [async-local-storage](https://github.com/vicanso/async-local-storage) - The underlying library that manages the storage.

## License

[MIT](LICENSE) © [Omri Litov](https://github.com/omrilitov)
