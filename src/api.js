// @ts-check

/**
 * @typedef Post
 * @property {number} id
 * @property {string} title
 * @property {string} content
 */

/**
 * @typedef APIResponse
 * @property {number} statusCode
 * @property {string | Object} body
 */

/**
 * @typedef Route
 * @property {RegExp} url
 * @property {'GET' | 'POST'} method
 * @property {(matches: string[], body: Object | undefined) => Promise<APIResponse>} callback
 */

const fs = require('fs');
const DB_JSON_FILENAME = 'database.json';

/** @returns {Promise<Post[]>} */
async function getPosts() {
  const json = await fs.promises.readFile(DB_JSON_FILENAME, 'utf-8');
  return JSON.parse(json).posts;
}

/** @param {Post[]} posts */
async function savePosts(posts) {
  const content = {
    posts,
  };
  return fs.promises.writeFile(
    DB_JSON_FILENAME,
    JSON.stringify(content),
    'utf-8'
  );
}

/** @type {Route[]} */
const routes = [
  {
    url: /^\/posts$/,
    method: 'GET',
    callback: async () => ({
      // TODO: implement
      statusCode: 200,
      body: await getPosts(),
    }),
  },
  {
    url: /^\/posts\/([a-zA-Z0-9-_]+)$/, // TODO: RegExp로 고쳐야 함.
    method: 'GET',
    /**
     * @param {any[]} matches
     */
    async callback(matches) {
      const postId = Number(matches[1]);
      if (!postId) {
        return {
          statusCode: 404,
          body: 'Not Found!',
        };
      }

      const post = posts.find((_post) => _post.id === postId);

      if (!post) {
        return {
          statusCode: 404,
          body: 'Not Found!',
        };
      }

      return {
        statusCode: 200,
        body: post,
      };
    },
  },
  {
    url: /^\/posts$/, // TODO: RegExp로 고쳐야 함.
    method: 'POST',
    callback: async (_, body) => {
      if (!body) {
        return {
          statusCode: 400,
          body: 'Ill-formed json',
        };
      }

      /**
       * @typedef ReqBody
       * @property {string} title
       * @property {string} content
       */

      /** @type {ReqBody | any} */
      const post = body;
      const posts = await getPosts();

      const newPost = {
        id: posts.length + 1,
        title: post.title,
        content: post.content,
      };

      posts.push(newPost);
      savePosts(posts);

      return {
        statusCode: 200,
        body: newPost,
      };
    },
  },
];

module.exports = {
  routes,
};
