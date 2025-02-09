'use strict'

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({message: 'Get goals'});
});

router.post('/', (req, res) => {
  res.status(200).json({message: 'Set goal'});
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  res.status(200).json({message: `Update goal ${id}`});
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  res.status(200).json({message: `Delete goal ${id}`});
});

module.exports = router;