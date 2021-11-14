const { Model } = require('objection');
const knex = require('../../db/knex');

Model.knex(knex);

class Interest extends Model {
  static get tableName() {
    return 'interests';
  }

  static get idColumn() {
    return 'interest_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        interest_id: { type: 'uuid' },
        created_at: new Date().toISOString(),
        name: { type: 'string', minLength: 3, maxLength: 64 },
        interest_number: { type: 'integer' },
      },
    };
  }
}

module.exports = Interest;
