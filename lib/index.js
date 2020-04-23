const als = require('async-local-storage');
const createWrapper = require('./wrapper');

const CONTEXT_NAME = 'pino-context';

als.enable();

// Override the default logger to add the http-context of logger
const logMethodHandler = options => target => (...args) => {
  const {showWhenEmpty = false} = options;
  const context = als.get(CONTEXT_NAME) || {};

  if (!showWhenEmpty && Object.keys(context).length === 0) {
    return target(...args);
  }

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

/**
 *
 * @param {object} instance A pino instance
 * @param {object} options
 * @param {boolean} options.showWhenEmpty Add the context object to each log even if empty
 */
const wrapLogger = (instance, options = {}) => {
  if (!instance) {
    throw new Error('A pino instance must be provided');
  }

  return createWrapper(instance, logMethodHandler(options));
};

/**
 * Add a key to the context object
 * @param {string} key
 * @param {*} value
 */
const addContext = (key, value) => {
  const context = als.get(CONTEXT_NAME);

  als.set(CONTEXT_NAME, {...context, [key]: value});
};

module.exports = {
  wrapLogger,
  addContext
};
