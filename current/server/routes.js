'use strict';

import path from 'path';
import * as auth from './auth/auth.service';
import UserView from './viewModels/user.viewModel';

export default function (app) {

  /*This path is added so that everyone can get a sense of the kind of patterns to following when creating new secure APIs*/
  app.get('/me', auth.isAuthenticated(), (req,res) => {
    let userInfo = new UserView(req.user);
    res.json(userInfo);
  });

  //only a doctor can access this path
  app.get('/test', auth.hasRole('doctor'), (req,res) => {
    //this user object is attached automatically from the service
    res.json(req.user);
  });

  //only a simple user can access this path
  app.get('/test2', auth.hasRole('user'), (req,res) => {
    //this user object is attached automatically from the service
    res.json(req.user);
  });

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
