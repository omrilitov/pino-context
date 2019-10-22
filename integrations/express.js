const als = require('async-local-storage');

module.exports = () => (req, res, next) => {
  setImmediate(async () => {
    als.scope();

    try {
      await next();
    } catch (err) {
      next(err);
    }
  });
};
