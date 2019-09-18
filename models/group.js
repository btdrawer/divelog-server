const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      max: 30
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message'
      }
    ]
  }
);

module.exports = mongoose.model('Group', GroupSchema);