'use strict';

const Address = require('./Address');
const ChatHandle = require('./ChatHandle');
const Email = require('./Email');
const Phone = require('./Phone');
const Property = require('./Property');
const SocialProfile = require('./SocialProfile');
const Website = require('./Website');

class Customer {
  constructor (client) {
    this.client = client;

    this.addresses = new Address(client);
    this.chatHandles = new ChatHandle(client);
    this.emails = new Email(client);
    this.phones = new Phone(client);
    this.properties = new Property(client);
    this.socialProfiles = new SocialProfile(client);
    this.websites = new Website(client);
  }

  create (data = {}) {
    return this.client.post('customers', data);
  }

  get (customerId, params = {}) {
    return this.client.get(`customers/${customerId}`, params);
  }

  list (params = {}) {
    return this.client.get('customers', params);
  }

  overwrite (customerId, data = {}) {
    return this.client.put(`customers/${customerId}`, data);
  }

  update (customerId, data = {}) {
    return this.client.patch(`customers/${customerId}`, data);
  }
}

module.exports = Customer;
