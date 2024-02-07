const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const movie = await service.read(request.params.movieId);
  if (movie) {
    response.locals.movie = movie;
    return next();
  }

  next({ status: 404, message: "Movie cannot be found."});
}

async function read(request, response) {
  const { movie: data } = response.locals;
  response.json({ data });
}

async function readMoviesTheaters(request, response) {
  const movieWithTheaters = await service.readMoviesTheaters(request.params.movieId);
  response.json( { data: movieWithTheaters});
}

async function readMoviesReviews(request, response) {
  const movieWithReviews = await service.readMoviesReviews(request.params.movieId);
  response.json( { data: movieWithReviews });
}

async function list(request, response) {
  const { is_showing } = request.query;
  console.log(is_showing);
  const data = await service.list(is_showing);
  response.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  readMoviesTheaters: [asyncErrorBoundary(movieExists), readMoviesTheaters],
  readMoviesReviews: [asyncErrorBoundary(movieExists), readMoviesReviews],
};
