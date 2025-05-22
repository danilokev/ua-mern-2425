// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',                           // todas las rutas que empiecen por /api
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      // pathRewrite: { '^/api': '/api' }, // opcional si quieres reescrituras
    })
  );
};