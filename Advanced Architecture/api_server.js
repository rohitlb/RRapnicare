var express = require('express');
var compression = require('compression');
var fs = require('fs');
var config = require('./server/api/configure');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'),
    promise = require('bluebird');

mongoose.Promise = promise;

//ssl configuration params here
//
//creating api and configuring it
var api = express();
api.disable('x-powered-by');
api.set('port',process.env.API_PORT || 2000);
api.set('env','development');

//middelwares
api.use(bodyParser.json());
api.use(compression());

api.get('/',function (req, res) {
	console.log(req.headers);
    res.send("hello your ip address is : "+req.headers);
    res.end();
});

//yet to set up routes
api = config(api);

mongoose.connect('mongodb://127.0.0.1/ApniCare');
mongoose.connection.on('open',function () {
    console.log('Mongoose connected');

    //server start
	api.listen(api.get('port'),function(){
		console.log('api server started');
	});
});

mongoose.connection.on('error',function () {
    console.log('failed to connect to the database server');
});
