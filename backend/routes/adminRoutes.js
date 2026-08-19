const express = require('express');
const { getSystemStats, getAllUsers, getAllTasks } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/authorize');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);
router.get('/tasks', getAllTasks);

module.exports = router;
