exports.up = function (knex) {
    return knex('users')
      .insert([{
        email: 'ekaterina.shakiryanova@gmail.com', login: 'kshak', password: '$2a$10$KeoUKEqKkIsesUiqYcMk/ODQYAALYoiRw/p51rattptmz9hUnBrM.', name: 'Katerina Shakiryanova', is_active: true, birthday: '2002-10-12', photo_id: 1,
      }, {
        email: 'lyyubava@gmail.com', login: 'lyubava32', password: '$2a$10$bKpghjtDvzlFIGy0ucXe8eXR0abZZ.5.b0m5EaQib9qdidy64Fime', name: 'Lyubov Smagluk', is_active: true, birthday: '2001-12-20', photo_id: 2,
      }, {
        email: 'valeriiadidych@gmail.com', login: 'valeriiiad', password: '$2a$10$k/l2JgtuewNW2vw2pYxfo.bURyEeUcU63kcP3GldcTt12wzT9oGlq', name: 'Valeria Didych', is_active: true, birthday: '2002-07-15', photo_id: 3,
      }]);
  };
  
  exports.down = function (knex) {
    return knex('users')
      .where({ login: 'kshak' } || { login: 'lyubava32' } || { login: 'valeriiiad' }).del();
  };
  