var express = require('express');
var compression = require('compression');
var fs = require('fs');
var config = require('./server/app/configure');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'),
    promise = require('bluebird');

mongoose.Promise = promise;

//ssl configuration params here
//
//creating app and configuring it
var app = express();
app.disable('x-powered-by');
app.set('port',process.env.API_PORT || 2000);
app.set('env','development');

//middelwares
app.use(bodyParser.json());
app.use(compression());

app.get('/',function (req, res) {
	console.log(req.headers);
    res.send("hello your ip address is : "+req.headers);
    res.end();
});

//yet to set up routes
app = config(app);

mongoose.connect('mongodb://127.0.0.1/ApniCare');
mongoose.connection.on('open',function () {
    console.log('Mongoose connected');

    //server start
	app.listen(app.get('port'),function(){
		console.log('app server started');
	});
});

mongoose.connection.on('error',function () {
    console.log('failed to connect to the database server');
});
