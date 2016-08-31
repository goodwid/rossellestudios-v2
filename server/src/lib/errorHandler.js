module.exports = (err, req, res, next) => { // eslint-disable-line
  let code = err.code || 500;
  if (!process.env.TEST) console.error(err);
  res.status(code).json({
    code,
    error: err.error || 'Server error',
    msg: err.msg,
  });
};
