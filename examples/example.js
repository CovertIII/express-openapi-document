const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();
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

const { specRouter, getSpec } = createRouteRegistry({router: app, openAPI: openAPIRoot});

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


app.get('/spec.json', (req, res) => {
  res.json(getSpec());
});
app.get('/spec.html', (_, res) => {
  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Swagger UI</title>
      <link rel="stylesheet" type="text/css" href="/swagger/swagger-ui.css" >
      <link rel="icon" type="image/png" href="/swagger/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="/swagger/favicon-16x16.png" sizes="16x16" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="/swagger/swagger-ui-bundle.js"> </script>
      <script src="/swagger/swagger-ui-standalone-preset.js"> </script>
      <script>
        window.onload = function() {
          var ui = SwaggerUIBundle({
            url: "/spec.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          })
          window.ui = ui
        }
      </script>
    </body>
  </html>`;
  res.send(html);
});

app.use('/swagger', express.static(pathToSwaggerUi));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
