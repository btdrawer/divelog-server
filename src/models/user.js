const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

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
    friends: {
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        }
      ],
      accepted: Boolean
    },
    isAdmin: Boolean
  }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  if (this.isModified('username')) {
    const user = await UserModel.findOne({
      username: this.username
    });

    if (user) throw new Error('A user with that username already exists.');
  }

  next();
});

UserSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({
      _id: this._id
  }, process.env.JWT_KEY);

  this.token = token;
  
  await this.save();

  return token;
};

UserSchema.statics.authenticate = async (username, password) => {
  const user = await UserModel.findOne({
    username: username
  });

  const errorMessage = 'Username or password incorrect.';

  if (!user) throw new Error(errorMessage);
  else if (!bcrypt.compareSync(password, user.password)) throw new Error(errorMessage);

  return user;
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;