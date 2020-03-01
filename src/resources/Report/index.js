'use strict';

const Company = require('./Company');
const Conversation = require('./Conversation');
const Docs = require('./Docs');
const Happiness = require('./Happiness');
const Productivity = require('./Productivity');
const User = require('./User');

class Report {
  constructor (client) {
    this.client = client;

    this.company = new Company(client);
    this.conversation = new Conversation(client);
    this.docs = new Docs(client);
    this.happiness = new Happiness(client);
    this.productivity = new Productivity(client);
    this.user = new User(client);
  }

  getChatReport (params = {}) {
    return this.client.get('reports/chat', params);
  }

  getEmailReport (params = {}) {
    return this.client.get('reports/email', params);
  }

  getPhoneReport (params = {}) {
    return this.client.get('reports/phone', params);
  }
}

module.exports = Report;
