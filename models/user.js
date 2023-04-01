const mongoose = require('mongoose');
const Post = require('./post');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        match : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
        required : true,
    },
    gender : {
        type : String,
        required  : true,
    },
    friendRequests: [
      {
        sender: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
      },
    ],
    receivedRequests: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'User',
        },
      ],
    friends: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'User',
        },
      ],
    post : [
        {
            type : mongoose.SchemaTypes.ObjectId,
            ref : 'Post',
        },
    ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;