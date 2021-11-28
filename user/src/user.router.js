/* eslint-disable camelcase */
const express = require('express');
const { authenticate } = require('./middlewares/auth');
const { mailInvite } = require('./helpers/mailer');
const {
  getUserByLogin,
  getUserByEmail,
  getUserById,
  updateUser,
  updatePassword,
  updatePhoto,
  isCurrentPasswordCorrect,
  invite,
  activate,
  getMatchedPeople,
} = require('./user.service');

const userRouter = express.Router();
userRouter.get('/me', authenticate, async (req, res) => {
  const userWithPhoto = await getUserByLogin(req.user.login);

  const { user, photo_link } = userWithPhoto;
  const { email, login, birthday } = user;

  res.status(200).send({
    email, login, birthday, photo_link,
  });
});

userRouter.put('/me', authenticate, async (req, res) => {
  const { user_id } = req.user;

  try {
    const user = await getUserById(user_id);
    if (req.body.currentPassword) {
      const match = await isCurrentPasswordCorrect(user, req.body.currentPassword);

      if (match) {
        await updatePassword(user_id, req.body);
        res.status(200).send('Password was successfully changed');
      }

      throw new Error('Current password is not correct');
    } else if (req.body.newPhotoLink) {
      await updatePhoto(user_id, req.body);
      res.status(200).send('Photo was successfully updated');
    } else {
      await updateUser(user_id, req.body);
      res.status(200).send('User was successfully updated');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.post('/invite', authenticate, async (req, res) => {
  const { email } = req.body;

  try {
    const link = await invite(req.body, req.user);
    res.status(200).send(await mailInvite(email, link));
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.put('/updatePassword', async (req, res) => {
  try {
    await updatePassword(req.body.user_id, req.body);
    res.status(200).send('Password was successfully changed');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.put('/updateUser', async (req, res) => {
  try {
    await updateUser(req.body.user_id, req.body);
    res.status(200).send('User was successfully updated');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.put('/updatePhoto', async (req, res) => {
  try {
    await updatePhoto(req.body.user_id, req.body);
    res.status(200).send('Photo was successfully updated');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.put('/activate', async (req, res) => {
  try {
    const user = await activate(req.body.user_id);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get('/', async (req, res) => {
  let user;
  if (req.query.login) {
    user = await getUserByLogin(req.query.login);
  } else if (req.query.email) {
    user = await getUserByEmail(req.query.email);
  } else {
    user = await getUserById(req.query.id);
  }

  res.status(200).send(user);
});

userRouter.get('/people', authenticate, async (req, res) => {
  try {
    const listOfPeople = await getMatchedPeople(req.user);
    res.status(200).send(listOfPeople);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = { userRouter };
