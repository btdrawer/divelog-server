const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiveSchema = new Schema(
  {
    time_in: {
      type: Date
    },
    time_out: {
      type: Date
    },
    safety_stop_time: {
      type: Number
    },
    max_depth: {
      type: Number
    },
    location: {
      type: String
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    buddies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    gear: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Gear'
      }
    ]
  }
);

module.exports = mongoose.mnodel('Dive', DiveSchema);