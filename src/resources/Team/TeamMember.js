'use strict';

class TeamMember {
  constructor (client) {
    this.client = client;
  }

  list (teamId, params = {}) {
    return this.client.get(`teams/${teamId}/members`, params);
  }
}

module.exports = TeamMember;
