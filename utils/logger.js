const fs = require('fs');
const path = require('path');

exports.logError = (err) => {
  const logPath = path.join(__dirname, '..', 'logs.txt');
  const log = `[${new Date().toISOString()}] ${err.stack || err.message}\n`;
  fs.appendFileSync(logPath, log);
};
