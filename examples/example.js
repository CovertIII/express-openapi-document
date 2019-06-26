const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3005;

const { createRouteRegistry } = require('../src/index.js');

app.use(bodyParser.json());

const openAPIRoot = {
  swagger: '2.0',
  info: {
    description: 'Example OpenAPI Document',
    version: '1.0.0',
    title: 'Express OpenAPI Document',
    contact: { email: 'me@example.com'}
  },
  host: 'localhost:' + port,
  basePath: '/',
  tags:[],
  schemes: [ 'http', 'https'],
  paths: {}
};

const postSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    body: { type: 'string' },
    author: { type: 'string' },
    date: { type: 'string', format: 'date-time' },
    tags: { type: 'array', items: { type: 'string' }},
  },
  required: ['title', 'body', 'author', 'date']
};

const { specRouter, serveSpec } = createRouteRegistry({router: app, openAPI: openAPIRoot});

const posts = [];

const registerRoutes = (app) => {
  app.post('/posts', (req, res) => {
    const { body, title, author, tags, date } = req.body;
    const post = {body, title, date, author, tags};
    posts.push(post);
    res.json(post);
  }, {
    description: 'save a post',
    operationId: 'savePost',
    parameters: [
      {
        name: 'post',
        in: 'body',
        description: '',
        required: true,
        schema: postSchema
      }
    ],
    responses: {
      200: {
        description: 'saved post',
        schema: postSchema
      }
    }
  });

  app.get('/posts', (req, res) => {
    res.json(posts);
  }, {
    description: 'get list of posts',
    responses: {
      200: {
        description: 'list of all posts',
        schema: {
          type: 'array',
          items: postSchema
        }
      }
    }
  });
};

registerRoutes(specRouter);

serveSpec({app, express});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
