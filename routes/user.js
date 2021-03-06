const router = require("express").Router();
const auth = require("../middlewares/auth");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
    let user = await User.findByCredentials(req.body.email, req.body.password);
    const authToken = await user.generateAuthToken();
    user = user.toJSON();
    delete user.password;
    res.status(200);
    res.json({
      user,
      authToken,
    });
  } catch (error) {
    res.status(401).json({
      error: true,
      message: error.message,
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    let user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const authToken = await user.generateAuthToken();
    user = user.toJSON();
    res.status(201);
    res.json({
      user,
      authToken,
    });
  } catch (error) {
    res.status(401).json({
      error: true,
      message: error.message,
    });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    // const user = req.user.toJSON();
    const user = await User.findById(req.user._id).populate(
      "currentTracks.track",
      "name _id"
    );
    console.log(user);
    delete user._doc.password;
    res.status(200).json({
      ...user._doc,
    });
  } catch (error) {
    res.status(401).json({
      error: true,
      message: error.message,
    });
  }
});

module.exports = router;
