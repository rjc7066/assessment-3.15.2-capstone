const db = require("../db/connection");

const tableName = "reviews as r";

async function destroy(reviewId) {
  return db(tableName).where({ "r.review_id": reviewId }).del();
}

async function list(movie_id) {
  return db(tableName)
    .join("critics as c", "c.critic_id", "r.critic_id")
    .where({"r.movie_id": movie_id})
    .select("r.*", "c.*")
    .then(reviews => Promise.all(reviews.map(setCritic)));
}

async function read(reviewId) {
  return db(tableName)
  .select("*")
  .where({"r.review_id": reviewId})
  .first();
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
