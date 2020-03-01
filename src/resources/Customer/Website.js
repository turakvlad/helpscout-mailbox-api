'use strict';

class Website {
  constructor (client) {
    this.client = client;
  }

  create (customerId, data = {}) {
    return this.client.post(`customers/${customerId}/websites`, data);
  }

  delete (customerId, websiteId) {
    return this.client.delete(`customers/${customerId}/websites/${websiteId}`);
  }

  list (customerId, params = {}) {
    return this.client.get(`customers/${customerId}/websites`, params);
  }

  update (customerId, websiteId, data = {}) {
    return this.client.put(`customers/${customerId}/websites/${websiteId}`, data);
  }
}

module.exports = Website;
