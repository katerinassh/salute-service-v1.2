exports.up = function (knex) {
    return knex('interests')
      .insert([{ name: 'Hanging out' }, { name: 'Faith' }, { name: 'Entertainment' }, { name: 'Languages' }, { name: 'AI' }, { name: 'Sport' }, { name: 'Art' }]);
  };
  
  exports.down = function (knex) {
    return knex('interests')
      .where({ name: 'Hanging out' } || { name: 'Faith' } || { name: 'Entertainment' } || { name: 'Languages' } || { name: 'AI' } || { name: 'Sport' } || { name: 'Art' }).del();
  };
  