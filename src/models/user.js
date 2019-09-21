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
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    friends: {
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        }
      ],
      accepted: {
        type: Boolean
      }
    },
    isAdmin: {
      type: Boolean
    }
  }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  if (this.isModified('username')) {
    const user = await UserModel.findOne(
      {
        username: this.username
      }
    );

    if (user) throw new Error('A user with that username already exists.');
  }

  next();
});

UserSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin
    }, 
    process.env.JWT_KEY
  );

  this.tokens.concat({token});
  
  await this.save();

  return token;
};

UserSchema.statics.authenticate = async (username, password) => {
  const user = await UserModel.findOne({
    username: username
  });

  if (!bcrypt.compareSync(password, user.password)) throw new Error('Username or password incorrect.');

  return user;
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;