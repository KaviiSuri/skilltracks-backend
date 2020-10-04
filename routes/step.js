const router = require("express").Router();
const auth = require("../middlewares/auth");
const Track = require("../models/Track");
const Step = require("../models/Step");

router.get("/complete/", auth, async (req, res) => {
  try {
    const { track_id, step_id } = req.body;
    console.log(track_id, step_id);
    req.user.currentTracks.forEach(({ track, progress }, i) => {
      if (track.equals(track_id) || track._id.equals(track_id)) {
        // progress.push(step_id);
        req.user.currentTracks[i].progress.push(step_id);
      }
    });
    // if(req.user.)
    await req.user.save();
    res.status(200);
    res.json({ message: "step marked successfully" });
  } catch (error) {
    res.status(error.status || 500).json({
      error: true,
      message: error.message,
    });
  }
});

router.get("/incomplete/", auth, async (req, res) => {
  try {
    const { track_id, step_id } = req.body;
    req.user.currentTracks.forEach(({ track, progress }, i) => {
      if (track.equals(track_id) || track._id.equals(track_id)) {
        // progress.push(step_id);
        req.user.currentTracks[i].progress = req.user.currentTracks[
          i
        ].progress.filter((id) => !id.equals(step_id));
      }
    });

    await req.user.save();
    res.status(200);
    res.json({ message: "step marked successfully" });
  } catch (error) {
    res.status(error.status || 500).json({
      error: true,
      message: error.message,
    });
  }
});

router.get("/:step_id", auth, async (req, res) => {
  try {
    const step = await Step.findById(req.params.step_id);
    // console.log(step);
    if (step) {
      res.status(200);
      res.json(step._doc);
    } else {
      const err = new Error("No Such Step Found");
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

module.exports = router;
