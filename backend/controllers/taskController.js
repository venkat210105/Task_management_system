const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Task = require('../models/Task');

const ALLOWED_STATUS = ['Todo', 'In Progress', 'Done'];
const ALLOWED_PRIORITY = ['Low', 'Medium', 'High'];
const ALLOWED_SORT_FIELDS = ['dueDate', 'priority', 'createdAt', 'title'];

// GET /api/tasks?status=&priority=&search=&page=&limit=&sortBy=&order=
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, sortBy, order } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

  const filter = { user: req.user._id };

  if (status) {
    if (!ALLOWED_STATUS.includes(status)) {
      throw new ApiError(400, `Invalid status filter: ${status}`);
    }
    filter.status = status;
  }

  if (priority) {
    if (!ALLOWED_PRIORITY.includes(priority)) {
      throw new ApiError(400, `Invalid priority filter: ${priority}`);
    }
    filter.priority = priority;
  }

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortOrder };

  // Priority has no natural sort order in MongoDB, so map it for correct High > Medium > Low sorting
  const usePriorityAggregation = sortField === 'priority';

  let tasks;
  let total;

  if (usePriorityAggregation) {
    const priorityRank = { High: 3, Medium: 2, Low: 1 };
    const [allMatching, count] = await Promise.all([
      Task.find(filter).lean(),
      Task.countDocuments(filter),
    ]);
    allMatching.sort((a, b) => {
      const diff = priorityRank[a.priority] - priorityRank[b.priority];
      return sortOrder === 1 ? diff : -diff;
    });
    total = count;
    tasks = allMatching.slice((page - 1) * limit, (page - 1) * limit + limit);
  } else {
    [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Task.countDocuments(filter),
    ]);
  }

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

// GET /api/tasks/:id
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found');
  res.json({ success: true, data: task });
});

// POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title || !title.trim()) {
    throw new ApiError(400, 'Title is required');
  }
  if (status && !ALLOWED_STATUS.includes(status)) {
    throw new ApiError(400, `Invalid status: ${status}`);
  }
  if (priority && !ALLOWED_PRIORITY.includes(priority)) {
    throw new ApiError(400, `Invalid priority: ${priority}`);
  }

  const task = await Task.create({
    user: req.user._id,
    title: title.trim(),
    description,
    status,
    priority,
    dueDate: dueDate || null,
  });

  res.status(201).json({ success: true, data: task });
});

// PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (status && !ALLOWED_STATUS.includes(status)) {
    throw new ApiError(400, `Invalid status: ${status}`);
  }
  if (priority && !ALLOWED_PRIORITY.includes(priority)) {
    throw new ApiError(400, `Invalid priority: ${priority}`);
  }

  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found');

  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate || null;

  await task.save();
  res.json({ success: true, data: task });
});

// PATCH /api/tasks/:id/complete
const markComplete = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found');

  task.status = 'Done';
  await task.save();
  res.json({ success: true, data: task });
});

// DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found');
  res.json({ success: true, data: {} });
});

// GET /api/tasks/analytics/summary
const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [statusResults, priorityResults] = await Promise.all([
    Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
  ]);

  const byStatus = { Todo: 0, 'In Progress': 0, Done: 0 };
  statusResults.forEach((r) => {
    byStatus[r._id] = r.count;
  });

  const byPriority = { Low: 0, Medium: 0, High: 0 };
  priorityResults.forEach((r) => {
    byPriority[r._id] = r.count;
  });

  const total = byStatus.Todo + byStatus['In Progress'] + byStatus.Done;
  const completed = byStatus.Done;
  const pending = total - completed;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({
    success: true,
    data: {
      total,
      completed,
      pending,
      completionPercentage,
      byStatus,
      byPriority,
    },
  });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  markComplete,
  deleteTask,
  getAnalytics,
};
