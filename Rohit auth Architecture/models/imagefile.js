var express = require('express');
var router = express.Router();
var multer = require('multer');
var bodyParser = require("body-parser")
var fs = require("fs");
var mongoose = require('mongoose');

var Image = require('./registration');

router.getImages = function(callback, limit) {
 
 Image.find(callback).limit(limit);
};

router.getImageById = function(id, callback) {
  
 Image.findById(id, callback);
 
};
 
router.addImage = function(image, callback) {
 Image.create(image, callback);
};

// To get more info about 'multer'.. you can go through https://www.npmjs.com/package/multer..

var storage = multer.diskStorage({
 destination: function(req, file, cb) {
 cb(null, 'uploads/')
 },
 filename: function(req, file, cb) {
 cb(null, file.originalname);
 }
});
 
var upload = multer({
 storage: storage
});
//
// router.get('/uploadimage', function(req, res, next) {
//     console.log('1');
//  res.render('profiles.pug');
// });
//
// router.post('/uploadimage', upload.any(), function(req, res) {
//
//     var test = bodyParser.toString(res)
//  res.send(test);
//
// /*req.files has the information regarding the file you are uploading...
// from the total information, i am just using the path and the imageName to store in the mongo collection(table)
// */
//
// // ## relate name and image name to sessionID (object ID)
//
//
//  var path = req.files[0].path;
//  var imageName = req.files[0].originalname;
//     //console.log(req.session.userID);
//     console.log(path);
//     console.log(imageName);
//
//     Image.update({Name : 'Rohit'},{
//         $set : {
//             'image.path' : path,
//             'image.originalname' : imageName
//         }
//
//     },function (err,result) {
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log(result);
//         }
//     });
//
//
//  // var imagepath = {};
//  //    console.log(imagepath);
//  // imagepath['path'] = path;
//  // imagepath['originalname'] = imageName;
//
//  //imagepath contains two objects, path and the imageName
//  //we are passing two objects in the addImage method.. which is defined above..
//  router.addImage(Image, function(err) {
//
//  });
//
// });
//======================================================================================

	router.get('/picture/:id',function(req,res){
		Image.findById(req.params.id,function(err,file){
			if (err) {
				throw err;
			}
			console.log(file);
			console.log(file.path);
			res.render("profile.pug",{image: file.path});

		});
	});

//======================================================================================
 
module.exports = router;