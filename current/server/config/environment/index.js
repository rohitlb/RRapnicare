import path from 'path';
import _ from 'lodash';

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var all = {
  env: process.env.NODE_ENV,

  // Root path of the server
  root: path.normalize(`${__dirname}/../..`),


};

// Export the config object based on the NODE_ENV
//===============================================

module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {}
);
