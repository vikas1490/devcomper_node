const advancedresults = (model, populate) => async (req, res, next) => {

    let query;

    const reqQuery = { ...req.query }
    const removeFields = ['select', 'sort', 'page', 'limit']
    console.log(reqQuery)

    removeFields.forEach(param => delete reqQuery[param])
    let queryStr = JSON.stringify(reqQuery);
    console.log(queryStr)

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/, (match) => `$${match}`)

    query = model.find(JSON.parse(queryStr))

    if (req.query.select) {

        const selectQuery = req.query.select.replace(/,/gi, " ")
        console.log(selectQuery)

        query = query.select(selectQuery)
    }
    if (req.query.sort) {

        const sortQuery = req.query.sort.replace(/,/gi, " ")

        query = query.sort(sortQuery)
    } else {
        query = query.sort('-createdAt')
    }
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments()

    query = query.skip(startIndex).limit(limit)
    if (populate) {
        query = query.populate(populate)
    }

    const results = await query;

    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        success: true, count: results.length, pagination, data: results
    }

    next()


}


module.exports = advancedresults