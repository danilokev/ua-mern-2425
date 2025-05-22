// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',                           // todas las rutas que empiecen por /api
    createProxyMiddleware({
      target: 'https://ua-mern-2425.onrender.com',
      changeOrigin: true,
      // pathRewrite: { '^/api': '/api' }, // opcional si quieres reescrituras
    })
  );
};
