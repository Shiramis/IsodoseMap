const express = require('express');
const router = express.Router();
const DoseMap = require('../models/DoseMap');

router.post('/', async (req, res) => {
  const { userId, name, data, imageBase64 } = req.body;
  const existing = await DoseMap.findOne({ userId, name });
  if (existing) return res.status(400).send({ error: 'Name already exists' });

  const newMap = new DoseMap({ userId, name, data, imageBase64 });
  await newMap.save();
  res.send(newMap);
});

router.get('/:userId', async (req, res) => {
  const maps = await DoseMap.find({ userId: req.params.userId });
  res.send(maps);
});

module.exports = router;
