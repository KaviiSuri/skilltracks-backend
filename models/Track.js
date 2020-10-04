const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
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
  forkedFrom: {
    type: mongoose.Types.ObjectId,
    ref: "Track",
    default: null,
  },
  category: {
    type: String,
    enum: [
      "UI / UX Design",
      "Graphic Design",
      "Development",
      "Machine Learning",
      "General",
    ],
    default: "General",
  },
});

module.exports = Track = mongoose.model("Track", trackSchema);
