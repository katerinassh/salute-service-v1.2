exports.up = function (knex) {
  return knex('photos')
    .insert([{ link: '../photos/img1', user_id: 1 }, { link: '../photos/img2', user_id: 2 }, { link: '../photos/img3', user_id: 3 }]);
};

exports.down = function (knex) {
  return knex('photos')
    .where({ link: '../photos/img1' } || { link: '../photos/img2' } || { link: '../photos/img3' }).del();
};
