/* eslint-disable camelcase */
const express = require('express');
const { uploadPhoto, getPhotoByNumber } = require('./service');

const router = express.Router();

router.post('/upload', async (req, res) => {
  const { link, user_id } = req.body;

  try {
    const photo = await uploadPhoto(link, user_id);
    res.status(200).send(photo);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/:photo_number', async (req, res) => {
  try {
    const photo = await getPhotoByNumber(req.params.photo_number);
    res.status(200).send(photo);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = { router };
