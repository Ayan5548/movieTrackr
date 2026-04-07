const express = require('express');
const router = express.Router();
const axios = require('axios');
const Movie = require('../models/movie.js');

const { isLoggedIn, isAuthor } = require("../middleware.js")

router.get("/movies", isLoggedIn, async (req, res) => {
  const movies = await Movie.find({author: req.user._id});
  res.render("index", { movies });
});

router.get("/movies/new", isLoggedIn, (req, res) => {
  res.render("new");
});

router.get("/movies/:id", isLoggedIn, isAuthor, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    const movied = await axios.get(
      `http://www.omdbapi.com/?i=tt3896198&apikey=cd71cfc&t=${movie.title}`,
    );
    res.render("details", { movie, movied });
  } catch (e) {
    res.send("couldn't find");
  }
});



router.post("/movies/search", isLoggedIn, async (req, res) => {
  try {
    const { title } = req.body;

    const movies = await Movie.find({ title, author: req.user._id });

    res.render("search", { movies });
  } catch (err) {
    console.log(err);
    res.send("Error fetching movies");
  }
});

router.post("/movies", isLoggedIn, async (req, res) => {
  const { title, rating, watchedDate } = req.body;
  const movie = new Movie({
    title: title,
    rating: rating,
    watchedDate: new Date(watchedDate),
    author: req.user._id
  });

  await movie.save();
  req.flash('success', 'successfully logged a movie!!')
  res.redirect("/movies");
});

router.put("/movies/:id", isLoggedIn, isAuthor, async (req, res) => {
  await Movie.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/movies");
});

router.delete("/movies/:id", isLoggedIn,isAuthor, async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.redirect("/movies");
});



module.exports = router;