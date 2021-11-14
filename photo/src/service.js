/* eslint-disable camelcase */
const Photo = require('./models/photo.model');

async function uploadPhoto(link, user_id) {
  return Photo.transaction(async (trx) => {
    const photo = await Photo.query(trx).insert({ link, user_id, is_main: true });
    return Photo.query(trx).findById(photo.photo_id);
  });
}

async function getPhotoByNumber(photo_number) {
  return Photo.query().where('photos.photo_number', photo_number).first();
}

module.exports = { uploadPhoto, getPhotoByNumber };
