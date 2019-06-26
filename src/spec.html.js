const renderHtml = ({swaggerPath, specPath}) => `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Swagger UI</title>
      <link rel="stylesheet" type="text/css" href="${swaggerPath}/swagger-ui.css" />
      <link rel="icon" type="image/png" href="/swagger/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="/swagger/favicon-16x16.png" sizes="16x16" />
    </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="${swaggerPath}/swagger-ui-bundle.js"> </script>
        <script src="${swaggerPath}/swagger-ui-standalone-preset.js"> </script>
        <script>
          window.onload = function() {
            var ui = SwaggerUIBundle({
              url: "${specPath}",
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

module.exports = {
  renderHtml
};
