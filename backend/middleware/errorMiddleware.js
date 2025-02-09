'use strict'

const { stack } = require("../routes/goalRoutes");

// Funciones que se ejecutan durante el ciclo de respuesta (res) de la petición (req).

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}

module.exports = {
  errorHandler,
}