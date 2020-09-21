const Course = require("../models/Course");
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')




/**
 * @desc Get All courses
 * @route /api/v1/bootcampId/courses
 *  * @route /api/v1/courses
 * @accesss Public
 */
exports.getCourses = asyncHandler(
    async (req, res, next) => {
        let query;
        console.log(req.params)
        if (req.params.bootCampId) {
            query = Course.find({ bootcamp: req.params.bootCampId })
        } else {
            query = Course.find()
        }

        const courses = await query.populate({ path: 'bootcamp', select: 'name description' })

        res
            .status(200)
            .json({ succes: true, count: courses.length, data: courses });
    }
)

/**
 * @desc Get single courses
 * @route /api/v1/courses/:id
 * @accesss Public
 */

exports.getCourse = asyncHandler(
    async (req, res, next) => {
        let query;

        query = Course.findById(req.params.id)


        const course = await query.populate({ path: 'bootcamp', select: 'name description' })
        if (!course) {
            return next(new ErrorResponse(`Course not found with id ${req.params.id}`), 404)
        }

        res
            .status(200)
            .json({ succes: true, count: course.length, data: course });
    }
)


exports.createCourse = asyncHandler(
    async (req, res, next) => {

        req.body.bootcamp = req.params.bootCampId
        const bootcamp = await Bootcamp.findById(req.params.bootCampId)
        if (bootcamp) {
            const course = await Course.create(req.body);
            res.status(201).json({
                succes: true,
                data: course,
            });
        } else {
            return next(new ErrorResponse(`Bootcamp not found with id ${req.params.bootCampId}`))
        }

    }
)


exports.updateCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
    if (!course) {
        return next(new ErrorResponse(`Course not found with id ${req.params.id}`), 404)
    }

    res
        .status(200)
        .json({ succes: true, count: course.length, data: course });
})


exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const courseTodelete = await Course.findByIdAndRemove(req.params.id)
    res
        .status(200)
        .json({ succes: true, data: 'Delteed' });
})