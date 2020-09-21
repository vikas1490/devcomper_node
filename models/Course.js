const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a Course Title']
    },
    description: {
        type: String,

        required: [true, 'Please add a Course Title']
    },
    weeks: {
        type: String,

        required: [true, 'Please add a Course Title']
    },
    tuition: {
        type: Number,

        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum Skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true

    }
})

module.exports = mongoose.model('Course', CourseSchema)