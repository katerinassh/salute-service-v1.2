const config = {
  mongodb: {
    url: 'mongodb://localhost:27017',

    databaseName: 'salute-auth',

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: './db/migrations',
  changelogCollectionName: 'changelog',

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: '.js',

  useFileHash: false,
};

// Return the config as a promise
module.exports = config;
