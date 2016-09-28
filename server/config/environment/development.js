'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://mwillcox:d4t4base@ds041526.mlab.com:41526/sffilmlocations'
  },

  // Seed database on startup
  seedDB: true

};
