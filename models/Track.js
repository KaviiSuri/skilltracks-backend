const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
  },
  steps: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Step",
    },
  ],
  name: {
    type: String,
    required: true,
  },
});

module.exports = Track = mongoose.model("Track", trackSchema);
