import fs from 'fs';
import path from 'path';

export const handleError = (message) => {
  const filePath = path.join(__appdir, 'logs', 'error.log');
  const timestamp = new Date().toISOString();

  const logMessage = `${timestamp} - Error: ${message}\n`;

  fs.appendFileSync(filePath, logMessage);

  throw new Error(message);
};

const errorHandler = (err, req, res, next) => {
  const filePath = path.join(__appdir, 'logs', 'error.log');
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Server Error';

  const message = `Method: ${req.method} Url: ${
    req.originalUrl
  } Date: ${new Date().toLocaleDateString(
    'en-US'
  )} Time: ${new Date().toLocaleTimeString('en-US')} Success: ${
    err.success
  } - Message: ${err.message}\n`;

  fs.appendFileSync(filePath, message);
  res
    .status(err.statusCode)
    .json({ success: err.success, message: err.message });
};

export default errorHandler;
export const log = (message) => {
  const filePath = path.join(__appdir, 'logs', 'app.log');
  const timestamp = new Date().toISOString();

  const logMessage = `${timestamp} - Log: ${message}\n`;

  fs.appendFileSync(filePath, logMessage);
};
