const url = require('url');

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('JSON inválido no corpo da requisição.'));
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

function sendJsonResponse(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function sendErrorResponse(res, statusCode, message) {
  sendJsonResponse(res, statusCode, { error: message });
}

module.exports = {
  getRequestBody,
  sendJsonResponse,
  sendErrorResponse,
};
