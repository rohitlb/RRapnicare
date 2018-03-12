'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import config from './environment';
import methodOverride from 'method-override';
import cors from "cors";
import helmet from 'helmet';

export default function (app) {

  app.set('appPath', path.join(
    path.normalize(`${config.root}/../`),
    'client'
  ));

  app.use(cors());
  app.use(helmet());
  app.use(express.static(app.get('appPath')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(methodOverride());
}
