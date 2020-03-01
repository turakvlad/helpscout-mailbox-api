'use strict';

const TeamMember = require('./TeamMember');

class Team {
  constructor (client) {
    this.client = client;

    this.teamMembers = new TeamMember(client);
  }

  list (params = {}) {
    return this.client.get('teams', params);
  }
}

module.exports = Team;
