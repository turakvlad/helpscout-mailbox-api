'use strict';

class CustomerProperty {
  constructor (client) {
    this.client = client;
  }

  list (params = {}) {
    return this.client.get('customer-properties', params);
  }
}

module.exports = CustomerProperty;
