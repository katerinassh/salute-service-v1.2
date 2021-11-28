module.exports = {
  async up(db) {
    await db.collection('logs').insertMany([{
      user_number: 1,
      entrances: [{
        time: new Date(),
        geo: [50.4333, 30.5167],
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_number: 2,
      entrances: [{
        time: new Date(),
        geo: [50.4547, 30.5238],
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_number: 3,
      entrances: [{
        time: new Date(),
        geo: [50.4547, 30.5238],
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  async down(db) {
    await db.collection('logs').deleteOne({ user_number: 1 });
    await db.collection('logs').deleteOne({ user_number: 2 });
    await db.collection('logs').deleteOne({ user_number: 3 });
  },
};
