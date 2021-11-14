const { Model } = require('objection');
const User = require('./user.model');
const Interest = require('./interest.model');
const knex = require('../../db/knex');

Model.knex(knex);

class UserInterest extends Model {
  static get tableName() {
    return 'user_interest';
  }

  static get idColumn() {
    return 'user_interest_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'interest_id'],

      properties: {
        user_id: { type: 'integer' },
        interest_id: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    return {
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.user_number',
          to: 'user_interest.user_id',
        },
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Interest,
        join: {
          from: 'interests.interest_number',
          to: 'user_interest.interest_id',
        },
      },
    };
  }
}

module.exports = UserInterest;
