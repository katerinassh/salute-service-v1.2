const express = require('express');
const {
  logIn, forgotPassword, resetPassword, register,
} = require('./service');
const { mailResetPassword } = require('./helpers/mailer');

const router = express.Router();
router.post('/login', async (req, res) => {
  try {
    res.status(200).send(await logIn(req.body));
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.post('/register', async (req, res) => {
  try {
    res.status(200).send(await register(req.query.id, req.body));
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.post('/forgotpass', async (req, res) => {
  const { email } = req.body;

  try {
    const link = await forgotPassword(email);
    res.status(200).send(await mailResetPassword(email, link));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/resetpass', async (req, res) => {
  try {
    await resetPassword(req.query.token, req.body);
    res.status(200).send('Password was successfully changed');
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = { router };
