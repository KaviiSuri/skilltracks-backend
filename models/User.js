const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const currTrackSchema = new mongoose.Schema(
  {
    track: {
      type: mongoose.Types.ObjectId,
      ref: "Track",
    },
    progress: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Step",
      },
    ],
  },
  {
    _id: false,
    timestamps: true,
  }
);
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email Address is required"],
      unique: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, "is invalid"],
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      required: [true, "is required"],
    },
    currentTracks: [currTrackSchema],
  },
  {
    timestamps: true,
  }
);

// generateAuthToken
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id.toString(),
    },
    process.env.JWT_SECRET
  );
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

userSchema.methods.followNewTrack = async function (track) {
  const user = this;
  user.currentTracks.push({
    track: track,
    progress: [],
  });
  return user.save();
};

userSchema.statics.findByCredentials = async function (email, passowrd) {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(passowrd, user.password);
  if (isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

module.exports = User = mongoose.model("User", userSchema);
