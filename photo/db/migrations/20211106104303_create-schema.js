exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  return knex.schema
    .createTable('photos', (table) => {
      table.uuid('photo_id').unique().notNullable().primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('link', 255);
      table.integer('user_id');
      table.boolean('is_main').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .raw('ALTER TABLE photos ADD COLUMN photo_number SERIAL UNIQUE');
};

exports.down = async (knex) => knex.schema.dropTable('photos');
