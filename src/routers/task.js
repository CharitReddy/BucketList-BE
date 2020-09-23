const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const Task = require('../models/task');

const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(
        new Error(
          'Please upload an image in the following formats : jpg/jpeg/png.'
        )
      );
    }
    cb(undefined, true);
  },
});

router.post(
  '/tasks/preTaskImages/:id',
  auth,
  upload.array('preTaskImages'),

  async (req, res) => {
    const _id = req.params.id;

    try {
      const task = await Task.findOne({ _id, owner: req.user._id });
      req.files.forEach((file) => {
        task.preTaskImages.push(file.buffer);
      });
      await task.save();
      res.send(200);
    } catch (error) {
      res.send(400).send({ error: error.message });
    }
  }
);

router.get('/tasks/preTaskImages/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || !task.preTaskImages) {
      throw new Error();
    }
    res.set('Content-Type', 'image/png');
    res.send(task.preTaskImages);
  } catch (error) {
    res.status(404).send();
  }
});

router.post('/tasks', auth, async (req, res) => {
  const taskToBeSaved = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await taskToBeSaved.save();
    res.status(201).send(taskToBeSaved);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    // -----By providing the user id.-----
    // const tasks = await Task.find({ owner: req.user._id });

    // -----Using execPopulate-----
    await req.user
      .populate({
        path: 'userTasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.userTasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['objective', 'motivation', 'completed', 'others'];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: 'The Update is not allowed.' });
  }
  try {
    const updatedTask = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!updatedTask) {
      res.status(404).send();
    }
    updates.forEach((update) => (updatedTask[update] = req.body[update]));
    await updatedTask.save();
    res.send(updatedTask);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!deletedTask) {
      return res.status(404).send({ error: 'Task Does Not exist.' });
    }
    res.send(deletedTask);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
