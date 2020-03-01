'use strict';

const axios = require('axios');
const EventEmitter = require('events');
const setUpBottleneck = require('./utils/set-up-bottleneck');

const Conversation = require('./resources/Conversation');
const Customer = require('./resources/Customer');
const CustomerProperty = require('./resources/CustomerProperty');
const Mailbox = require('./resources/Mailbox');
const Rating = require('./resources/Rating');
const Report = require('./resources/Report');
const Tag = require('./resources/Tag');
const Team = require('./resources/Team');
const User = require('./resources/User');
const Webhook = require('./resources/Webhook');
const Workflow = require('./resources/Workflow');

class HelpScout extends EventEmitter {
  constructor ({
    clientId,
    clientSecret,
    authenticationFlow
  } = {}) {
    if (clientId === undefined) {
      throw new Error('The "clientId" parameter must be passed.');
    }

    if (clientSecret === undefined) {
      throw new Error('The "clientSecret" parameter must be passed.');
    }

    if (authenticationFlow === undefined) {
      throw new Error('The "authenticationFlow" parameter must be passed.');
    }

    if (!['clientCredentials', 'OAuth2'].includes(authenticationFlow)) {
      throw new Error(`The "${authenticationFlow}" authentication flow is not supported!`);
    }

    super();

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.authenticationFlow = authenticationFlow;

    this.bottleneck = setUpBottleneck(this);

    this.requestOptions = {
      baseURL: 'https://api.helpscout.net/v2/'
    };

    this.conversations = new Conversation(this);
    this.customerProperties = new CustomerProperty(this);
    this.customers = new Customer(this);
    this.mailboxes = new Mailbox(this);
    this.ratings = new Rating(this);
    this.reports = new Report(this);
    this.tags = new Tag(this);
    this.teams = new Team(this);
    this.users = new User(this);
    this.webhooks = new Webhook(this);
    this.workflows = new Workflow(this);
  }

  /*
  * Public methods.
  * */

  generateAuthorizationUri (state) {
    return `https://secure.helpscout.net/authentication/authorizeClientApplication?client_id=${this.clientId}${state ? `&state=${state}` : ''}`;
  }

  async getTokens (code) {
    if (this.authenticationFlow === 'OAuth2' && code === undefined) {
      throw new Error('The "code" parameter must be passed when "OAuth2" authentication flow is set!');
    }

    const data = {
      client_id: this.clientId,
      client_secret: this.clientSecret
    };

    if (this.authenticationFlow === 'clientCredentials') {
      data.grant_type = 'client_credentials';
    }

    if (this.authenticationFlow === 'OAuth2') {
      data.code = code;
      data.grant_type = 'authorization_code';
    }

    const response = await axios.post('https://api.helpscout.net/v2/oauth2/token', data);

    const { data: tokens } = response;

    return tokens;
  }

  setCredentials (tokens) {
    this.credentials = tokens;
  }

  updateBottleneckOptions (bottleneckOptions = {}) {
    this.bottleneck.updateSettings(bottleneckOptions);
  }

  updateRequestOptions (requestOptions = {}) {
    delete requestOptions.baseUrl;

    this.requestOptions = Object.assign(this.requestOptions, requestOptions);
  }

  /*
  * Private methods.
  * */

  async refreshAccessToken () {
    if (this.isRefreshingAccessTokenInProgress === true) {
      return this.waitForRefreshingAccessTokenToBeFinished();
    }

    try {
      this.startRefreshingAccessToken();

      const data = {
        client_id: this.clientId,
        client_secret: this.clientSecret
      };

      if (this.authenticationFlow === 'clientCredentials') {
        data.grant_type = 'client_credentials';
      }

      if (this.authenticationFlow === 'OAuth2') {
        data.grant_type = 'refresh_token';
        data.refresh_token = this.credentials.refresh_token;
      }

      const response = await axios.post('https://api.helpscout.net/v2/oauth2/token', data);

      const { data: tokens } = response;

      this.emit('tokens', tokens);
      this.setCredentials(tokens);
    } finally {
      this.finishRefreshingAccessToken();
    }
  }

  startRefreshingAccessToken () {
    this.isRefreshingAccessTokenInProgress = true;
  }

  waitForRefreshingAccessTokenToBeFinished () {
    return new Promise((resolve, reject) => {
      const tryUpToTimes = 50;
      const timeout = 50;
      let time;

      const intervalId = setInterval(() => {
        if (this.isRefreshingAccessTokenInProgress === false) {
          clearInterval(intervalId);
          return resolve();
        }

        if (time === tryUpToTimes) {
          clearInterval(intervalId);
          return reject(new Error());
        }

        time++;
      }, timeout);
    });
  }

  finishRefreshingAccessToken () {
    this.isRefreshingAccessTokenInProgress = false;
  }

  async handleRequest (bottleneckOptions, requestOptions) {
    return this.bottleneck.schedule(bottleneckOptions, () =>
      axios.request({
        ...this.requestOptions,
        headers: {
          common: {
            Authorization: `Bearer ${this.credentials.access_token}`
          }
        },
        ...requestOptions
      })
    );
  }

  delete (endpoint) {
    return this.handleRequest(
      {
        weight: 2
      },
      {
        url: endpoint,
        method: 'DELETE'
      }
    );
  }

  get (endpoint, params = {}) {
    return this.handleRequest(
      {
        weight: 1
      },
      {
        url: endpoint,
        method: 'GET',
        params
      }
    );
  }

  patch (endpoint, data = {}) {
    return this.handleRequest(
      {
        weight: 2
      },
      {
        url: endpoint,
        method: 'PATCH',
        data
      }
    );
  }

  post (endpoint, data = {}) {
    return this.handleRequest(
      {
        weight: 2
      },
      {
        url: endpoint,
        method: 'POST',
        data
      }
    );
  }

  put (endpoint, data = {}) {
    return this.handleRequest(
      {
        weight: 2
      },
      {
        url: endpoint,
        method: 'PUT',
        data
      }
    );
  }

  nextPage ({ next }) {
    return this.handleRequest(
      {
        weight: 1
      },
      {
        url: next.href,
        method: 'GET'
      }
    );
  }
}

module.exports = HelpScout;
