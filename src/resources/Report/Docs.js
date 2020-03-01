'use strict';

class Docs {
  constructor (client) {
    this.client = client;
  }

  getOverallReport (params = {}) {
    return this.client.get('reports/docs', params);
  }
}

module.exports = Docs;
