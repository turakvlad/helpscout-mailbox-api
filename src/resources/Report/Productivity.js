'use strict';

class Productivity {
  constructor (client) {
    this.client = client;
  }

  getOverallReport (params = {}) {
    return this.client.get('reports/productivity', params);
  }

  getFirstResponseTimeReport (params = {}) {
    return this.client.get('reports/productivity/first-response-time', params);
  }

  getRepliesSentReport (params = {}) {
    return this.client.get('reports/productivity/replies-sent', params);
  }

  getResolutionTimeReport (params = {}) {
    return this.client.get('reports/productivity/resolution-time', params);
  }

  getResolvedReport (params = {}) {
    return this.client.get('reports/productivity/resolved', params);
  }

  getResponseTimeReport (params = {}) {
    return this.client.get('reports/productivity/response-time', params);
  }
}

module.exports = Productivity;
