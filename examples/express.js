const express = require('express');
const pino = require('pino');
const {addContext, wrapLogger} = require('../');
const expressScopeMiddleware = require('../integrations/express');
const logger = wrapLogger(pino());
const app = express();

app.use(expressScopeMiddleware());

app.use((req, res, next) => {
  logger.info('This is an empty log');
  addContext('requestId', 'unique identifier'); // Generate some unique identifier
  next();
});

app.use((req, res, next) => {
  logger.info('This is a log');
  next();
});

app.use((req, res, next) => {
  addContext('url', req.url);
  next();
});

app.get('/', (req, res) => {
  logger.info({hello: 'world'}, 'This is another log');
  res.send('Hello World');
});

app.listen(1337, () => {
  logger.info('Listening');
});
