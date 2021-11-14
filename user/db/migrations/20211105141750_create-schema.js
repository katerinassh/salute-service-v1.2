exports.up = async (knex) => {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  
    return knex.schema
      .createTable('users', (table) => {
        table.uuid('user_id').unique().notNullable().primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('email', 255).notNullable();
        table.string('login', 25);
        table.string('password', 255);
        table.string('name', 255);
        table.boolean('is_active');
        table.date('birthday');
        table.integer('invites_amount').defaultTo(2);
        table.integer('photo_id');
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .raw('ALTER TABLE users ADD COLUMN user_number SERIAL UNIQUE;')
  
      .createTable('interests', (table) => {
        table.uuid('interest_id').unique().notNullable().primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name', 64);
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .raw('ALTER TABLE interests ADD COLUMN interest_number SERIAL UNIQUE')
  
      .createTable('user_interest', (table) => {
        table.uuid('user_interest_id').unique().notNullable().primary()
          .defaultTo(knex.raw('uuid_generate_v4()'));
        table.integer('user_id')
          .references('user_number')
          .inTable('users');
        table.integer('interest_id')
          .references('interest_number')
          .inTable('interests');
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
  };
  
  exports.down = async (knex) => knex.schema.dropTable('user_interest').dropTable('interests').dropTable('users');
  