const { createCustomError } = require('../errors/custom-error');
const asyncWrapper = require('../middlewares/async');
const Task = require('../models/Task');

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(200).json({ tasks });
  // res.status(200).json({ tasks, amount: tasks.length });
  // res.status(200).json({ status: 'success', data: {tasks, nbHits: tasks.length} });
  // res.status(200).json({ success: true, data: {tasks, nbHits: tasks.length} });
});

const createTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ task });
});

const getTask = asyncWrapper(async (req, res,next) => {
  const { id: taskId } = req.params;
  const task = await Task.findOne({ _id: taskId });
  if (!task) {
    return next(createCustomError(`No task with id: ${taskId}`))
  }
  res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res) => {
  const { id: taskId } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskId });
  if (!task) {
    return next(createCustomError(`No task with id: ${taskId}`));
  }
  
  //  res.status(200).json({ task });
  // res.status(200).send();
  res.status(200).json({ task: null, status: 'success' });
});

const updateTask = asyncWrapper(async (req, res) => {
  const { id: taskId } = req.params;

  const task = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return next(createCustomError(`No task with id: ${taskId}`));
  }

  res.status(200).json({ task });
});

const editTask = asyncWrapper(async (req, res) => {
  const { id: taskId } = req.params;

  const task = await Task.findOneAndUpdate({ _id: taskId }, req.body, {
    new: true,
    runValidators: true,
    overwrite: true,
  });

  if (!task) {
    return res.status(404).json({ msg: `No task with id: ${taskId}` });
  }

  res.status(200).json({ task });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  editTask,
};
