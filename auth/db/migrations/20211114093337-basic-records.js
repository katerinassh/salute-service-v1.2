module.exports = {
  async up(db) {
    await db.collection('logs').insertMany([{
      user_number: 1,
      entrances: [new Date()],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_number: 2,
      entrances: [new Date()],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_number: 3,
      entrances: [new Date()],
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
