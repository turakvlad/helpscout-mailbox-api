'use strict';

class Property {
  constructor (client) {
    this.client = client;
  }

  update (customerId, data = {}) {
    return this.client.put(`customers/${customerId}/properties`, data);
  }
}

module.exports = Property;
