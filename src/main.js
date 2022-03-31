// @ts-check
const { rejects } = require('assert');
const http = require('http');

const { routes } = require('./api');

const server = http.createServer((req, res) => {
  async function main() {
    const route = routes.find(
      (_route) =>
        req.url &&
        req.method &&
        _route.url.test(req.url) &&
        _route.method === req.method
    );

    if (!req.url || !route) {
      res.statusCode = 404;
      res.end('Not Found.');
      return;
    }

    const regexResult = route.url.exec(req.url);

    if (!regexResult) {
      res.statusCode = 404;
      res.end('Not Found.');
      return;
    }

    /** @type {Object.<string, *> | undefined} */
    const reqBody =
      (req.headers['content-type'] === 'application/json' &&
        (await new Promise((resolve, reject) => {
          req.setEncoding('utf-8');
          req.on('data', (data) => {
            try {
              resolve(JSON.parse(data));
              // eslint-disable-next-line node/no-unsupported-features/es-syntax
            } catch {
              reject(new Error('Ill-formed json'));
            }
          });
        }))) ||
      undefined;

    const result = await route.callback(regexResult, reqBody);
    res.statusCode = result.statusCode;

    if (typeof result.body === 'string') {
      res.end(result.body);
    } else {
      res.setHeader('Content-Type', 'application/json; encoding=utf-8');
      res.end(JSON.stringify(result.body));
    }
  }

  main();
});

const PORT = 4000;

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is listening at port: ${PORT}`);
});
