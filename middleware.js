const Movie = require("./models/movie")

module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You must be logged in first!');
  res.redirect('/login');
}

module.exports.isAuthor = async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie.author.equals(req.user._id)) {
    return res.send("Unauthorized");
  }

  next();

}