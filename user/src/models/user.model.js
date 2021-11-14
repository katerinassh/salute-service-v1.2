const { Model } = require('objection');
const knex = require('../../db/knex');
const Interest = require('./interest.model');

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'user_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email'],

      properties: {
        user_id: { type: 'uuid' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: { type: 'string', minLength: 8, maxLength: 255 },
        password: { type: 'string', minLength: 8, maxLength: 255 },
        login: { type: 'string', minLength: 6, maxLength: 25 },
        birthday: { type: 'string', format: 'date' },
        photo_id: { type: 'integer' },
        user_number: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    return {
      interest: {
        relation: Model.ManyToManyRelation,
        modelClass: Interest,
        from: 'users.user_number',
        through: {
          from: 'user_interest.user_id',
          to: 'user_interest.interest_id',
        },
        to: 'interests.interest_number',
      },
    };
  }
}

module.exports = User;
