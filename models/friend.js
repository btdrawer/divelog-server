const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema(
  {
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
  }
);

module.exports = mongoose.model('Friend', FriendSchema);