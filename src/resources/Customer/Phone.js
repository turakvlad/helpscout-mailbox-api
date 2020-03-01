'use strict';

class Phone {
  constructor (client) {
    this.client = client;
  }

  create (customerId, data = {}) {
    return this.client.post(`customers/${customerId}/phones`, data);
  }

  delete (customerId, phoneId) {
    return this.client.delete(`customers/${customerId}/phones/${phoneId}`);
  }

  list (customerId, params = {}) {
    return this.client.get(`customers/${customerId}/phones`, params);
  }

  update (customerId, phoneId, data = {}) {
    return this.client.put(`customers/${customerId}/phones/${phoneId}`, data);
  }
}

module.exports = Phone;
