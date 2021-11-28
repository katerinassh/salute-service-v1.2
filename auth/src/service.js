/* eslint-disable max-len */
/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { models } = require('./models/index');
require('dotenv').config();

const { Log } = models;

async function logIn(geo, body) {
  /* eslint-disable no-shadow */
  const { login, password } = body;

  const response = await axios.get(`${process.env.USER_URL}/user?login=${login}`);
  const { data } = response;
  if (!data) {
    throw new Error('Login is incorrect');
  }

  const match = await bcrypt.compare(password, data.user.password);

  if (match) {
    const {
      user_id, email, birthday, photo_id, created_at, updated_at, user_number,
    } = data.user;
    const log = await Log.findOne({ user_number });

    const newEntrance = { time: new Date(), geo };
    await Log.updateOne({ user_number }, {
      $set: {
        entrances: [...log.entrances, newEntrance],
      },
    });

    const payload = {
      user_id,
      email,
      login,
      birthday,
      photo_id,
      created_at,
      updated_at,
      user_number,
    };
    return jwt.sign(payload, process.env.JWTSECRETKEY);
  }
  throw new Error('Password is incorrect');
}

async function register(user_id, geo, body) {
  const {
    name, login, password, passwordAgain, birthday, photo_link, interests,
  } = body;

  const response = await axios.get(`${process.env.USER_URL}/user?id=${user_id}`);
  const userNotRegister = response.data;
  if (!userNotRegister) {
    throw new Error('Person wasn`t invited!');
  }
  if (userNotRegister.is_active) {
    throw new Error('This user is already registrated');
  }

  await axios.put(`${process.env.USER_URL}/user/updatePassword`, {
    user_id,
    newPassword: password,
    newPasswordAgain: passwordAgain,
  });
  await axios.put(`${process.env.USER_URL}/user/updateUser`, {
    user_id, name, login, birthday,
  });
  await axios.put(`${process.env.USER_URL}/user/updatePhoto`, { user_id, newPhotoLink: photo_link });
  await axios.put(`${process.env.USER_URL}/interest/update`, { user_id, interests });
  const result = await axios.put(`${process.env.USER_URL}/user/activate`, { user_id });
  const { user_number } = result.data;

  const entrance = { time: new Date(), geo };
  await Log.create({ user_number, entrances: [entrance] });

  const token = await logIn(geo, { login, password });
  return token;
}

async function forgotPassword(email) {
  const response = await axios.get(`${process.env.USER_URL}/user?email=${email}`);
  if (response.data) {
    const token = jwt.sign({ email }, process.env.JWTSECRETKEY, { expiresIn: '30m' });

    return `http://${process.env.HOST}:${process.env.APP_PORT}/auth/resetpass?token=${token}`;
  }
  throw new Error('User with such email doesn`t exist');
}

async function resetPassword(token, body) {
  const decryptedToken = jwt.verify(token, process.env.JWTSECRETKEY);

  const response = await axios.get(`${process.env.USER_URL}/user?email=${decryptedToken.email}`);
  const user = response.data;

  /* eslint-disable no-param-reassign */
  body.user_id = user.user_id;
  await axios.put(`${process.env.USER_URL}/user/updatePassword`, body);
}

async function getLogByUserNumber(user_number) {
  return Log.findOne({ user_number });
}

module.exports = {
  logIn, forgotPassword, resetPassword, register, getLogByUserNumber,
};
