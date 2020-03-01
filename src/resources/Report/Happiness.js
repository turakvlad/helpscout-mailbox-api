'use strict';

class Happiness {
  constructor (client) {
    this.client = client;
  }

  getOverallReport (params = {}) {
    return this.client.get('reports/happiness', params);
  }

  getRatingsReport (params = {}) {
    return this.client.get('reports/happiness/ratings', params);
  }
}

module.exports = Happiness;
