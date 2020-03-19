const mongoose = require("mongoose");
const { USERNAME_EXISTS, INVALID_AUTH } = require("../variables/errorKeys");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { hashPassword, signJwt } = require("../authentication/authTools");

const UserSchema = new Schema({
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
  email: {
    type: String,
    required: true,
    max: 30
  },
  password: {
    type: String,
    required: true
  },
  token: String,
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  friend_requests: {
    inbox: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    sent: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  }
});

const isUsernameTaken = async username => {
  const user = await UserModel.findOne({
    username
  });
  if (user) {
    throw new Error(USERNAME_EXISTS);
  }
  return undefined;
};

UserSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  if (this.isModified("username")) {
    await isUsernameTaken(this.username);
  }
  this.token = signJwt(this._id);
  next();
});

UserSchema.pre("findOneAndUpdate", async function(next) {
  const { username, password } = this._update;
  if (password) {
    this._update.password = await hashPassword(password);
  }
  if (username) {
    await isUsernameTaken(username);
  }
  next();
});

UserSchema.statics.authenticate = async (username, password) => {
  const user = await UserModel.findOne({
    username: username
  });
  if (!user) {
    throw new Error(INVALID_AUTH);
  } else if (!bcrypt.compareSync(password, user.password)) {
    throw new Error(INVALID_AUTH);
  }
  user.token = signJwt(user._id);
  user.save();
  return user;
};

UserSchema.statics.add = async (myId, friendId) => {
  const user = await UserModel.findOneAndUpdate(
    {
      _id: myId
    },
    {
      $push: {
        "friend_requests.sent": friendId
      }
    },
    { new: true }
  );

  await UserModel.findOneAndUpdate(
    {
      _id: friendId
    },
    {
      $push: {
        "friend_requests.inbox": myId
      }
    }
  );

  return user;
};

UserSchema.statics.accept = async (myId, friendId) => {
  const user = await UserModel.findOneAndUpdate(
    {
      _id: myId
    },
    {
      $push: {
        friends: friendId
      },
      $pull: {
        "friend_requests.inbox": friendId
      }
    },
    { new: true }
  );

  await UserModel.findOneAndUpdate(
    {
      _id: friendId
    },
    {
      $push: {
        friends: myId
      },
      $pull: {
        "friend_requests.sent": myId
      }
    }
  );

  return user;
};

UserSchema.statics.unfriend = async (myId, friendId) => {
  const user = await UserModel.findOneAndUpdate(
    {
      _id: myId
    },
    {
      $pull: {
        friends: friendId
      }
    },
    { new: true }
  );

  await UserModel.findOneAndUpdate(
    {
      _id: friendId
    },
    {
      $pull: {
        friends: myId
      }
    }
  );

  return user;
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
