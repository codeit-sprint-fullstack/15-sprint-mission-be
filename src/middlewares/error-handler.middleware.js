export const errorHandler = ((error, req, res, next) => { 
  //error handling
  const statusCode  = error.statusCode  || 500;
  const message     = error.message     ||'서버이슈';

  res.status(statusCode).json({
    success: false,
    message,
  });
});