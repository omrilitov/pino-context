const pino = require('pino');
const als = require('async-local-storage');
const createWrapper = require('./wrapper');

const CONTEXT_NAME = 'pino-context';

als.enable();

// Override the default logger to add the http-context of logger
const logMethodHandler = target => (...args) => {
  const context = als.get(CONTEXT_NAME) || {};

  const [firstArg, ...rest] = args;
  let finalArgList;

  if (typeof firstArg === 'string') {
    // Log was called only with message, no local context
    finalArgList = [{context}, firstArg, ...rest];
  } else {
    // Log was called local context, so we merge it into clsContext
    finalArgList = [{context, ...firstArg}, ...rest];
  }

  return target(...finalArgList);
};

exports.createLogger = (instance = pino()) => createWrapper(instance, logMethodHandler);

exports.addContext = (key, value) => {
  const context = als.get(CONTEXT_NAME);

  als.set(CONTEXT_NAME, {...context, [key]: value});
};
