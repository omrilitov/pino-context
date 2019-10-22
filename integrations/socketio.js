const als = require('async-local-storage');

module.exports = () => (socket, next) => {
  setImmediate(async () => {
    als.scope();

    try {
      await next();
    } catch (err) {
      next(err);
    }
  });
};
