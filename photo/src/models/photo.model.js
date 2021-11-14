const { Model } = require('objection');
const knex = require('../../db/knex');

Model.knex(knex);

class Photo extends Model {
  static get tableName() {
    return 'photos';
  }

  static get idColumn() {
    return 'photo_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['link', 'is_main', 'user_id'],

      properties: {
        photo_id: { type: 'uuid' },
        created_at: new Date().toISOString(),
        link: { type: 'string', maxLength: 255 },
        user_id: { type: 'integer' },
        is_main: { type: 'boolean' },
        photo_number: { type: 'integer' },
      },
    };
  }
}

module.exports = Photo;
