const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Path = require("path");

/**
 * @desc Get All bootcamps
 * @route /api/v1/bootcamps
 * @accesss Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc Get All bootcamps
 * @route /api/v1/bootcamps/:id
 * @accesss Public
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`),
      404
    );
  }
  res.status(200).json({ succes: true, data: bootcamp });
});

/**
 * @desc Create bootcamps
 * @route /api/v1/bootcamps
 * @accesss Private
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    succes: true,
    data: bootcamp,
  });
});

/**
 * @desc Update bootcamps
 * @route /api/v1/bootcamps/:id
 * @accesss Private
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`),
      404
    );
  }
  res.status(201).json({ success: true, data: bootcamp });
});

/**
 * @desc Delete bootcamps
 * @route /api/v1/bootcamps/:id
 * @accesss Private
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`),
      404
    );
  }
  bootcamp.remove();
  res.status(201).json({ success: true, data: bootcamp });
});

/**
 * @desc Delete bootcamps
 * @route /api/v1/bootcamps/:id
 * @accesss Private
 */
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  console.log(req.files);

  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`),
      404
    );
  }
  const file = req.files.file;

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`), 404);
  }

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a an image`), 404);
  }
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less the ${process.env.MAX_FILE_UPLOAD}`
      ),
      404
    );
  }
  console.log(Path.parse(file.name));
  file.name = `photo_${bootcamp._id}${Path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(err.toString()));
    }
  });

  await Bootcamp.findByIdAndUpdate(bootcamp._id, { photo: file.name });

  res.status(200).json({ success: true, data: file.name });
  console.log(file.name);
});
