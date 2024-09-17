const development = (err, res) => {
  const response = {
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  };
  res.status(err.statusCode).json(response);
};
const production = (err, res) => {
  if (err.isOperational) {
    const response = {
      status: err.status,
      message: err.message,
    };
    res.status(err.statusCode).json(response);
  } else {
    const response = {
      status: 500,
      message: 'Something went wrong please try again later',
    };
    res.status(err.statusCode).json(response);
  }
};
const fn = (err) => {
  console.log(err.message);
  let message = err.message.split(': ');
  message = message[1].toUpperCase() + ' error: ' + message[2];
  err.message = message;
  return err;
};
const ErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.TYPE === 'Development') {
    development(err, res);
  } else {
    if (err.message.startsWith('E11000 duplicate key error collection')) {
      err.message =
        'This Email is used by someone else. Please use different email';
    } else if (
      err.message.startsWith('User validation failed') ||
      err.message.startsWith('Job validation failed:')
    ) {
      err = fn(err);
    } else if (
      err.message.startsWith('Cast to ObjectId failed for value') ||
      err.message.startsWith('Cannot read properties of null')
    ) {
      err.message = 'Object Id is invalid';
    }
    production(err, res);
  }
};

module.exports = ErrorHandler;
