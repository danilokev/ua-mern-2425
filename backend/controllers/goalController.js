'use strict'
const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');
 

// @desc Get goals
// @route GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });

  res.status(200).json(goals);
});

// @desc Set goal
// @route POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Introduce un texto válido');
  }

  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id, 
  });

  res.status(200).json(goal);
});

// @desc Update goal
// @route Update /api/goals/:id
// @access Private
const updateGoal = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const goal = await Goal.findById(id);

  if (!goal) {
    res.status(400);
    throw new Error('Goal not found');
  }

  const user = await User.findById(req.user.id)

  // Comprobar si hay usuario
  if(!user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Asegurarse de que el usuario autenticado coincide con su goal respectivo
  if(goal.user.toString !== user.id){
    res.status(401)
    throw new Error('User not authorized')
  }

  const updateGoal = await Goal.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json(updateGoal);
});

// @desc Delete goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const goal = await Goal.findById(id);

  if (!goal) {
    res.status(400);
    throw new Error('Goal not found');
  }

  const user = await User.findById(req.user.id)

  // Comprobar si hay usuario
  if(!user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Asegurarse de que el usuario autenticado coincide con su goal respectivo
  if(goal.user.toString !== user.id){
    res.status(401)
    throw new Error('User not authorized')
  }

  await Goal.findByIdAndDelete(id);

  res.status(200).json({ id: id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal
}