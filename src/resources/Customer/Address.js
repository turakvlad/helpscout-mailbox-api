'use strict';

class Address {
  constructor (client) {
    this.client = client;
  }

  create (customerId, data = {}) {
    return this.client.post(`customers/${customerId}/address`, data);
  }

  delete (customerId) {
    return this.client.delete(`customers/${customerId}/address`);
  }

  get (customerId) {
    return this.client.get(`customers/${customerId}/address`);
  }

  update (customerId, data = {}) {
    return this.client.put(`customers/${customerId}/address`, data);
  }
}

module.exports = Address;
