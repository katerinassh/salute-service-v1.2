/* eslint-disable camelcase */
/* eslint-disable max-len */
const axios = require('axios');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./models/user.model');

async function isUserExists(email) {
  const users = await User.query().where('users.email', email);
  return Boolean(users.length);
}

async function getUserByLogin(login) {
  let photo;
  const user = await User.query().where('users.login', login).first();
  if (user) {
    const response = await axios.get(`${process.env.PHOTO_URL}/photo/${user.photo_id}`);
    photo = response.data;
    return { user, photo_link: photo.link };
  }

  return { user };
}

async function getUserByEmail(email) {
  return User.query().where('users.email', email).first();
}

async function getUserById(user_id) {
  return User.query().findById(user_id);
}

async function createUnactiveUser(email) {
  return User.query().insert({ email, is_active: false });
}

async function isCurrentPasswordCorrect(user, currentPassword) {
  const match = await bcrypt.compare(currentPassword, user.password);
  return Boolean(match);
}

async function updatePassword(user_id, body) {
  const { newPassword, newPasswordAgain } = body;
  if (!newPassword || !newPasswordAgain) throw new Error('Not all fields are filled');
  if (newPassword !== newPasswordAgain) throw new Error('Password mismatch');

  return User.transaction(async (trx) => {
    const user = await User.query(trx).findById(user_id);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await User.query(trx).update(user).where('user_id', user_id);

    return User.query(trx).findById(user_id);
  });
}

async function updateUser(user_id, body) {
  const { login, name, birthday } = body;
  if (login) {
    const res = await getUserByLogin(login);
    if (res.user) throw new Error('- that login is taken -');
  }

  return User.transaction(async (trx) => {
    const user = await User.query(trx).findById(user_id);
    user.login = login || user.login;
    user.name = name || user.name;
    user.birthday = birthday || user.birthday;
    await User.query(trx).update(user).where('user_id', user_id);

    return User.query(trx).findById(user_id);
  });
}

async function updatePhoto(user_id, body) {
  const { newPhotoLink } = body;

  return User.transaction(async (trx) => {
    const user = await User.query(trx).findById(user_id);

    const res = await axios.post(`${process.env.PHOTO_URL}/photo/upload`, {
      link: newPhotoLink,
      user_id: user.user_number,
    });
    const photo = res.data;
    user.photo_id = photo.photo_number;
    await User.query(trx).update(user).where('user_id', user_id);

    return User.query(trx).findById(user_id);
  });
}

async function increaseInvitesAmount(user_id) {
  return User.transaction(async (trx) => {
    const user = await User.query(trx).findById(user_id);
    user.invites_amount -= 1;
    await User.query(trx).update(user).where('user_id', user_id);

    return User.query(trx).findById(user_id);
  });
}

async function invite(body, user) {
  const { email } = body;
  const inviter = await User.query().findById(user.user_id);

  if (inviter.invites_amount === 0) {
    throw new Error('Not enough invites amount');
  }

  if (!(await isUserExists(email))) {
    const newUser = await createUnactiveUser(email);
    await increaseInvitesAmount(inviter.user_id);

    return `${process.env.AUTH_URL}/auth/register?id=${newUser.user_id}`;
  }
  throw new Error('User with such email already exists');
}

async function activate(user_id) {
  return User.transaction(async (trx) => {
    const user = await User.query(trx).findById(user_id);
    user.is_active = true;
    await User.query(trx).update(user).where('user_id', user_id);

    return User.query(trx).findById(user_id);
  });
}

module.exports = {
  getUserByLogin,
  getUserByEmail,
  getUserById,
  createUnactiveUser,
  isUserExists,
  increaseInvitesAmount,
  isCurrentPasswordCorrect,
  updateUser,
  updatePassword,
  updatePhoto,
  invite,
  activate,
};
