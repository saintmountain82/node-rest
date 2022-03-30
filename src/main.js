// @ts-check
const http = require('http');

/**
 * @typedef Post
 * @property {number} id
 * @property {string} title
 * @property {string} content
 */

/** @type {Post[]} */
const posts = [
  {
    id: 1,
    title: 'My first post',
    content: 'Hello, First!',
  },
  {
    id: 2,
    title: 'My second post',
    content: 'Hello, Second!',
  },
  {
    id: 3,
    title: 'My third post',
    content: 'Hello, Third!',
  },
];

const server = http.createServer((req, res) => {
  const POSTS_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/;
  const postIdRegexResult =
    (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined;

  if (req.url === '/posts' && req.method === 'GET') {
    const result = {
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
      })),
      totalCount: posts.length,
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; encoding=utf-8');
    res.end(JSON.stringify(result));
  } else if (postIdRegexResult && req.method === 'GET') {
    // GET /posts/:id
    const postId = Number(postIdRegexResult[1]);
    const post = posts.find((_post) => _post.id === postId);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; encoding=utf-8');
    res.end(JSON.stringify(post));
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.setEncoding('utf-8');
    req.on('data', (data) => {
      /**
       * @typedef PostBody
       * @property {string} title
       * @property {string} content
       */

      /** @type {PostBody} */
      const body = JSON.parse(data);
      posts.push({
        id: posts.length + 1,
        title: body.title,
        content: body.content,
      });
    });
    res.statusCode = 200;
    res.end('Create post');
  } else {
    res.statusCode = 404;
    res.end('OK');
  }
});

const PORT = 4000;

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is listening at port: ${PORT}`);
});
