const successMsg = (res, statusCode, message, data) => {
  res
    .status(statusCode)
    .json({
      status: 'success',
      message,
      data,
    });
};

const errorMsg = (res, statusCode, error) => {
  res
    .status(statusCode)
    .json({
      status: 'fail',
      error,
    });
};

export {
  successMsg,
  errorMsg,
};
