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

module.exports = {
  posts,
};
