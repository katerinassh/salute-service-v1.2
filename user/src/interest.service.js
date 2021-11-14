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

module.exports = { updateInterests };
