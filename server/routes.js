'use strict';

import path from 'path';

export default function (app) {

  /** GET /health-check - Check service health */
  app.get('/health-check', (req, res) =>
    res.send('OK')
  );

  //add more app paths here

  app.use('/auth', require('./auth'));

  app.route('/:url(api|auth|components|app|assets)/*')
    .get((req,res) => {
      console.log('I am called');
      res.status(404).json({message: 'The requested route is not on this server'});
    });

  app.route('*')
    .get((req,res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
