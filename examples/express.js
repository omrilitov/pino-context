const express = require('express');
const {addContext, createLogger} = require('../');
const expressScopeMiddleware = require('../integrations/express');
const logger = createLogger();
const app = express();

app.use(expressScopeMiddleware());

app.use((req, res, next) => {
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
  logger.info('This is another log');
  res.send('Hello World');
});

app.listen(1337, () => {
  logger.info('Listening');
});
