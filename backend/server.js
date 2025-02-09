'use strict'

const port = process.env.PORT || 5000;
const express = require('express');
const dotenv = require('dotenv').config;
const app = express();

app.use('/api/goals', require('./routes/goalRoutes'));

app.listen(port, () => {
  console.log(`Server ejecutándose en el puerto ${port}`);
});