const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  markComplete,
  deleteTask,
  getAnalytics,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/analytics/summary', getAnalytics);

router.route('/').get(getTasks).post(createTask);

router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

router.patch('/:id/complete', markComplete);

module.exports = router;
