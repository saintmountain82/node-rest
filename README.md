# Node 프레임워크없이 REST API 만들기

## nodemon 사용
- npm i nodemon

## jsdoc : 타입 정의
```js
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
    ];
```