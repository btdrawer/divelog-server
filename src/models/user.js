const mongoose = require('mongoose');
const errorKeys = require('../variables/errorKeys');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('../authentication/helpers/jwt');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      max: 40
    },
    username: {
      type: String,
      required: true,
      max: 15
    },
    password: {
      type: String,
      required: true
    },
    token: String,
    friends: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      accepted: Boolean
    }],
    friend_requests: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) this.password = bcrypt.hashSync(this.password, 10);

  if (this.isModified('username')) {
    const user = await UserModel.findOne({
      username: this.username
    });
  
    if (user) throw new Error(errorKeys.USERNAME_EXISTS);
  }

  this.token = jwt(this._id);

  next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(this._update.password, 10);
  }

  if (this._update.username) {
    const user = await UserModel.findOne({
      username: this._update.username
    });

    if (user) throw new Error(errorKeys.USERNAME_EXISTS);
  }

  next();
})

UserSchema.statics.authenticate = async (username, password) => {
  const user = await UserModel.findOne({
    username: username
  });

  const errorMessage = errorKeys.INVALID_AUTH;

  if (!user) throw new Error(errorMessage);
  else if (!bcrypt.compareSync(password, user.password)) throw new Error(errorMessage);

  user.token = jwt(user._id);
  user.save();

  return user;
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;