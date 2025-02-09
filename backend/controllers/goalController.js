'use strict'
// @desc Get goals
// @route GET /api/goals
// @access Private
const getGoals = (req, res) => {
  res.status(200).json({ message: 'Get goals' });
}

// @desc Set goal
// @route POST /api/goals
// @access Private
const setGoal = (req, res) => {
  res.status(200).json({ message: 'Set goal' });
}

// @desc Update goal
// @route Update /api/goals/:id
// @access Private
const updateGoal = (req, res) => {
  const id = req.params.id;
  res.status(200).json({ message: `Update goal ${id}` });
}

// @desc Delete goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal = (req, res) => {
  const id = req.params.id;
  res.status(200).json({ message: `Delete goal ${id}` });
}

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal
}