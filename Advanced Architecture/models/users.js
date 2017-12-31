var mongoose = require('mongoose'),
    promise = require('bluebird');

mongoose.Promise = promise;

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UsersSchema = new Schema(
    {
        user_id: {type: ObjectId},
        mobNum: {type: String},
        password: {type: String},
        isRegistered: Boolean
    }
);

module.exports = mongoose.model('Users',UsersSchema);