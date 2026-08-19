const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const Task = require('../models/Task');

// GET /api/admin/stats
const getSystemStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalTasks, completedTasks] = await Promise.all([
    User.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ status: 'Done' }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
    },
  });
});

// GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();

  const taskCounts = await Task.aggregate([{ $group: { _id: '$user', count: { $sum: 1 } } }]);
  const countMap = new Map(taskCounts.map((t) => [String(t._id), t.count]));

  const data = users.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    taskCount: countMap.get(String(u._id)) || 0,
    createdAt: u.createdAt,
  }));

  res.json({ success: true, data });
});

// GET /api/admin/tasks?page=&limit=
const getAllTasks = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

  const [tasks, total] = await Promise.all([
    Task.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Task.countDocuments(),
  ]);

  res.json({
    success: true,
    data: tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

module.exports = { getSystemStats, getAllUsers, getAllTasks };
