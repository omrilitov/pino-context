// Proxy an instance of pino to return the proper proxy
const loggerObjectHandler = {
  get(target, prop) {
    if (target.proxies && target.proxies[prop]) {
      return target.proxies[prop];
    }

    return target[prop];
  }
};

function createWrapper(instance, logWrapper) {
  const loggerWithProxies = Object.create(instance, {
    proxies: {
      value: {
        trace: logWrapper(instance.trace.bind(instance)),
        debug: logWrapper(instance.debug.bind(instance)),
        info: logWrapper(instance.info.bind(instance)),
        warn: logWrapper(instance.warn.bind(instance)),
        error: logWrapper(instance.error.bind(instance)),
        fatal: logWrapper(instance.fatal.bind(instance)),

        // Override the child method to return a wrapped instance
        child: new Proxy(instance.child, {
          apply(target, thisArg, argumentList) {
            return createWrapper(target.apply(thisArg, argumentList), logWrapper);
          }
        })
      }
    }
  });

  return new Proxy(loggerWithProxies, loggerObjectHandler);
}

module.exports = createWrapper;
