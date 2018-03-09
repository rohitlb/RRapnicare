'use strict';

import express from 'express';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
mongoose.Promise = bluebird;
import config from './config/environment';
import http from 'http';

var app = express();
var server = http.createServer(app);

require('./config/express').default(app);
require('./routes').default(app);

mongoose.connect(config.mongo.uri);
mongoose.connection.on('open', () => {
  server.listen(config.port, () => {
    console.log(`Express server listening on %d, in %s mode`, config.port, app.get('env'));
  });
});
mongoose.connection.on('error', (err) => {
  console.log(`MongoDB error occured: ${err}`);
  process.exit(-1);
});
