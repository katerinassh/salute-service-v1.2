const express = require('express');
const { updateInterests } = require('./interest.service');

const interestRouter = express.Router();

interestRouter.put('/update', async (req, res) => {
  try {
    res.status(200).send(await updateInterests(req.body));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = { interestRouter };
