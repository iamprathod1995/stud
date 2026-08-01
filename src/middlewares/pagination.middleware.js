module.exports = (req, res, next) => {

  req.pagination = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10
  };

  next();

};