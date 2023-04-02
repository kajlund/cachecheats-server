exports.paging = async (req, res, next) => {
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 50
  const skip = (page - 1) * limit
  req.paging = {
    page,
    limit,
    skip,
  }
  next()
}
