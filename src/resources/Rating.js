'use strict';

class Rating {
  constructor (client) {
    this.client = client;
  }

  get (ratingId) {
    return this.client.get(`ratings/${ratingId}`);
  }
}

module.exports = Rating;
