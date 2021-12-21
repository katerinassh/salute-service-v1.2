const express = require('express');
const { getGeo } = require('./middlewares/geo');
const {
  logIn, forgotPassword, resetPassword, register, getLogByUserNumber,
} = require('./service');
const { mailResetPassword } = require('./helpers/mailer');

const router = express.Router();
router.post('/login', getGeo, async (req, res) => {
  try {
    res.status(200).send(await logIn(req.geo, req.body));
  } catch (err) {
    res.status(404).send(err.message);
  }
});

router.post('/register', getGeo, async (req, res) => {
  try {
    res.status(200).send(await register(req.query.id, req.geo, req.body));
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

router.get('/log', async (req, res) => {
  try {
    res.status(200).send(await getLogByUserNumber(req.query.user_number));
  } catch (err) {
    res.status(404).send(err.message);
  }
});

module.exports = { router };
