const router = require("express").Router();
const auth = require("../middlewares/auth");
const Track = require("../models/Track");
const Step = require("../models/Step");

router.get("/", async (req, res) => {
  try {
    const tracks = await Track.find({}).populate("author", "name _id");
    res.status(200);
    res.json({
      tracks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const track = await Track.create({
      name: req.body.name,
      author: req.user,
      steps: [],
      category: req.body.category,
    });
    await req.user.followNewTrack(track._id);
    res.status(201);
    res.json(track);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

router.get("/:track_id", auth, async (req, res) => {
  try {
    const track = await Track.findById(req.params.track_id)
      .populate("steps")
      .populate("author", "name _id");
    if (track) {
      res.status(200);
      res.json(track);
    } else {
      const err = Error("No suck track found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    res.status(error.status || 500).json({
      error: true,
      message: error.message,
    });
  }
});

router.post("/add-step/:track_id", auth, async (req, res) => {
  try {
    const track = await Track.findById(req.params.track_id);
    console.log(typeof track.author.toString());
    console.log(typeof req.user._id.toString());
    if (track.author.toString() === req.user._id.toString()) {
      const step = await Step.create({
        name: req.body.name,
        description: req.body.description,
        resources: req.body.resources || [],
        extras: req.body.extras || [],
      });
      track.steps.push(step);
      await track.save();
      res.status(200);
      res.json(track._doc);
    } else {
      const err = Error("You do not have the access to edit this track");
      err.status = 401;
      throw err;
    }
  } catch (error) {
    res.status(error.status || 500).json({
      error: true,
      message: error.message,
    });
  }
});

router.get("/fork/", auth, async (req, res) => {
  try {
    const newTrack = await Track.create({
      author: req.user,
      name: req.body.name,
      steps: [],
      forkedFrom: req.body.source_id,
    });
    req.user.currentTracks.forEach(({ track, progress }) => {
      if (track === req.body.source_id) {
        newTrack.steps = [...progress];
      }
    });
    await newTrack.save();
    await req.user.followNewTrack(newTrack._id);
    req.user.currentTracks = req.user.currentTracks.filter(
      ({ track, progress }) => track !== req.body.track_id
    );
    await req.user.save();
    res.status(200);
    res.json({ newTrack });
  } catch (error) {
    res.status(error.status || 500).json({
      error: true,
      message: error.message,
    });
  }
});

module.exports = router;
