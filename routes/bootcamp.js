const express = require("express");
const { protect } = require("../middlewares/auth");

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadBootcampPhoto,
} = require("../controllers/bootcamps");

const advancedResults = require("../middlewares/advancedResult");

const Bootcamp = require("../models/Bootcamp");

//Inlcude other resources

const CourseRouter = require("./course");

const router = express.Router();

router.use("/:bootCampId/courses", CourseRouter);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, createBootcamp);
router.route("/:id/photo").put(protect, uploadBootcampPhoto);

router
  .route("/:id")
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp)
  .get(getBootcamp);

module.exports = router;
