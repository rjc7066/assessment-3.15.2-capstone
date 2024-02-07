const db = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at"
});

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  return db("movies")
  .select("*")
  .where({ "movies.movie_id": movie_id})
  .first()
}

async function readMoviesTheaters(movie_id) {
  return db("movies as m")
  .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
  .join("theaters as t", "mt.theater_id", "t.theater_id")
  .select("*")
  .where({ "m.movie_id": movie_id})
}

async function readMoviesReviews(movie_id) {
  return db("movies as m")
  .join("reviews as r", "m.movie_id", "r.movie_id")
  .join("critics as c", "r.critic_id", "c.critic_id")
  .select("m.*", "c.*", "r.*")
  .where({"m.movie_id": movie_id})
  .then(reviews => Promise.all(reviews.map(addCritic)));
}

module.exports = {
  list,
  read,
  readMoviesTheaters,
  readMoviesReviews,
};
