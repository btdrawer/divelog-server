const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      max: 30
    },
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    messages: [{
      text: {
        type: String,
        required: true
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  }
);

GroupSchema.methods.addMessage = async (message_id) => {
  this.messages.push(message_id);
};

const GroupModel = mongoose.model('Group', GroupSchema);

module.exports = GroupModel;