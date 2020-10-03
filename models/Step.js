const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true,
  },
  description: {
    type: String,
  },
  resources: [
    {
      content: String,
      link: {
        type: String,
        match: [
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
          "invalid url for the resource",
        ],
        required: [true, "link is required"],
      },
    },
  ],
  extras: [
    {
      content: String,
      link: {
        type: String,
        match: [
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
          "invalid url for the resource",
        ],
        required: [true, "link is required"],
      },
    },
  ],
});

module.exports = Step = mongoose.model("Step", stepSchema);
