/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
require('dotenv').config();
const Interest = require('./models/interest.model');
const UserInterest = require('./models/user-interest.model');
const { getUserById } = require('./user.service');

async function updateInterests(body) {
  const { user_id, interests } = body;

  const user = await getUserById(user_id);
  await UserInterest.query().delete().where('user_interest.user_id', user.user_number);

  // eslint-disable-next-line no-restricted-syntax
  for (const name of interests) {
    const interest = await Interest.query().where('interests.name', name).first();
    if (interest) {
      await UserInterest.query().insert(
        {
          user_id: user.user_number,
          interest_id: interest.interest_number,
        },
      );
    } else {
      throw new Error('Such interest doesn`t exist');
    }
  }

  return UserInterest.query().where('user_interest.user_id', user.user_number);
}

async function getInterestsInfo(interestIds) {
  const interests = [];
  for (const number of interestIds) {
    const interest = await Interest.query().where('interest_number', number).first();
    interests.push(interest);
  }

  return interests;
}

async function getInterestsNumbers(user_number) {
  const interestsIds = await UserInterest.query().where('user_id', user_number).select('interest_id');
  return interestsIds.map((elem) => elem.interest_id);
}

async function getUsersWithMatchedInterests(interestsIds, user_number) {
  const users = [];
  for (const interest_number of interestsIds) {
    const records = await UserInterest.query().where('interest_id', interest_number);

    for (const record of records) {
      if (record.user_id !== user_number) {
        const elem = users.find((user) => user.user_number === record.user_id);
        if (!elem) {
          users.push({ user_number: record.user_id, commonCount: 1 });
        } else {
          elem.commonCount += 1;
        }
      }
    }
  }

  return users;
}

module.exports = {
  updateInterests, getInterestsInfo, getInterestsNumbers, getUsersWithMatchedInterests,
};
