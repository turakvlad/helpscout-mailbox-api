'use strict';

jest.mock('../src/utils/set-up-bottleneck');

const axios = require('axios');
const nock = require('nock');

const HelpScout = require('../index');
const setUpBottleneck = require('../src/utils/set-up-bottleneck');

const Conversation = require('../src/resources/Conversation');
const Customer = require('../src/resources/Customer');
const CustomerProperty = require('../src/resources/CustomerProperty');
const Mailbox = require('../src/resources/Mailbox');
const Rating = require('../src/resources/Rating');
const Report = require('../src/resources/Report');
const Tag = require('../src/resources/Tag');
const Team = require('../src/resources/Team');
const User = require('../src/resources/User');
const Webhook = require('../src/resources/Webhook');
const Workflow = require('../src/resources/Workflow');

describe('index.js', () => {
  const clientId = 'clientId';
  const clientSecret = 'clientSecret';
  const mockObject = {
    prop: 'value'
  };

  afterEach(() => {
    jest.restoreAllMocks();
    setUpBottleneck.mockClear();
  });

  describe('constructor', () => {
    it('should fail if a client ID was not passed', () => {
      expect(() => new HelpScout()).toThrow('The "clientId" parameter must be passed.');
    });

    it('should fail if a client secret was not passed', () => {
      expect(() => new HelpScout({ clientId })).toThrow('The "clientSecret" parameter must be passed.');
    });

    it('should fail if an authentication flow was not passed', () => {
      expect(() => new HelpScout({
        clientId,
        clientSecret
      })).toThrow('The "authenticationFlow" parameter must be passed.');
    });

    it('should fail if a passed authentication flow is not supported', () => {
      expect(() => new HelpScout({
        clientId,
        clientSecret,
        authenticationFlow: 'nonSupportedAuthenticationFlow'
      })).toThrow('The "nonSupportedAuthenticationFlow" authentication flow is not supported!');
    });

    it('should create and initialize a class instance with "clientCredentials" authentication flow set', () => {
      const helpscout = new HelpScout({
        clientId,
        clientSecret,
        authenticationFlow: 'clientCredentials'
      });

      expect(helpscout).toBeInstanceOf(HelpScout);
      expect(helpscout).toBeInstanceOf(require('events'));

      expect(helpscout.clientId).toBe(clientId);
      expect(helpscout.clientSecret).toBe(clientSecret);
      expect(helpscout.authenticationFlow).toBe('clientCredentials');

      expect(helpscout.requestOptions.baseURL).toBe('https://api.helpscout.net/v2/');

      expect(setUpBottleneck).toHaveBeenCalledTimes(1);
      expect(setUpBottleneck).toHaveBeenCalledWith(helpscout);

      expect(helpscout.conversations).toBeInstanceOf(Conversation);
      expect(helpscout.customerProperties).toBeInstanceOf(CustomerProperty);
      expect(helpscout.customers).toBeInstanceOf(Customer);
      expect(helpscout.mailboxes).toBeInstanceOf(Mailbox);
      expect(helpscout.ratings).toBeInstanceOf(Rating);
      expect(helpscout.reports).toBeInstanceOf(Report);
      expect(helpscout.tags).toBeInstanceOf(Tag);
      expect(helpscout.teams).toBeInstanceOf(Team);
      expect(helpscout.users).toBeInstanceOf(User);
      expect(helpscout.webhooks).toBeInstanceOf(Webhook);
      expect(helpscout.workflows).toBeInstanceOf(Workflow);
    });
  });

  describe('methods', () => {
    let helpscout;

    beforeEach(() => {
      helpscout = new HelpScout({
        clientId,
        clientSecret,
        authenticationFlow: 'clientCredentials'
      });
    });

    it('should generate an authorization URI', () => {
      expect(helpscout.generateAuthorizationUri()).toBe(
        `https://secure.helpscout.net/authentication/authorizeClientApplication?client_id=${clientId}`
      );
    });

    it('should generate an authorization URI with a state parameter', () => {
      expect(helpscout.generateAuthorizationUri('state')).toBe(
        `https://secure.helpscout.net/authentication/authorizeClientApplication?client_id=${clientId}&state=state`
      );
    });

    it('should return tokens when "clientCredentials" flow is set)', async () => {
      helpscout = new HelpScout({
        clientId,
        clientSecret,
        authenticationFlow: 'clientCredentials'
      });

      nock('https://api.helpscout.net/v2')
        .post('/oauth2/token', {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials'
        })
        .reply(200, {
          token_type: 'bearer',
          access_token: 'access_token',
          expires_in: 172800
        });
      jest.spyOn(axios, 'post');

      await expect(helpscout.getTokens()).resolves.toEqual({
        token_type: 'bearer',
        access_token: 'access_token',
        expires_in: 172800
      });
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('https://api.helpscout.net/v2/oauth2/token', {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      });
    });

    it('should return tokens when "OAuth2" flow is set', async () => {
      helpscout = new HelpScout({
        clientId,
        clientSecret,
        authenticationFlow: 'OAuth2'
      });

      nock('https://api.helpscout.net/v2')
        .post('/oauth2/token', {
          client_id: clientId,
          client_secret: clientSecret,
          code: 'code',
          grant_type: 'authorization_code'
        })
        .reply(200, {
          refresh_token: 'refresh_token',
          token_type: 'bearer',
          access_token: 'access_token',
          expires_in: 172800
        });
      jest.spyOn(axios, 'post');

      await expect(helpscout.getTokens('code')).resolves.toEqual({
        refresh_token: 'refresh_token',
        token_type: 'bearer',
        access_token: 'access_token',
        expires_in: 172800
      });
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('https://api.helpscout.net/v2/oauth2/token', {
        client_id: clientId,
        client_secret: clientSecret,
        code: 'code',
        grant_type: 'authorization_code'
      });
    });

    it('should update request options', () => {
      expect(helpscout.requestOptions).toEqual({
        baseURL: 'https://api.helpscout.net/v2/'

      });

      helpscout.updateRequestOptions({
        timeout: 1000
      });

      expect(helpscout.requestOptions).toEqual({
        baseURL: 'https://api.helpscout.net/v2/',
        timeout: 1000
      });
    });

    it('should not override a "baseUrl" property', () => {
      expect(helpscout.requestOptions).toEqual({
        baseURL: 'https://api.helpscout.net/v2/'
      });

      helpscout.updateRequestOptions({
        baseUrl: 'baseUrl'
      });

      expect(helpscout.requestOptions).toEqual({
        baseURL: 'https://api.helpscout.net/v2/'
      });
    });

    it('should update Bottleneck options', () => {
      helpscout.updateBottleneckOptions(mockObject);

      expect(helpscout.bottleneck.updateSettings).toHaveBeenCalledTimes(1);
      expect(helpscout.bottleneck.updateSettings).toHaveBeenCalledWith(mockObject);
    });

    it('should refresh an access token by making a POST request when "clientCredentials" flow is set', async () => {
      helpscout = new HelpScout({
        clientId,
        clientSecret,
        authenticationFlow: 'clientCredentials'
      });

      expect(helpscout.credentials).toBeUndefined();

      const oldTokens = {
        token_type: 'bearer',
        access_token: 'old_access_token',
        expires_in: 172800
      };

      helpscout.setCredentials(oldTokens);

      expect(helpscout.credentials).toEqual(oldTokens);

      const newTokens = {
        token_type: 'bearer',
        access_token: 'new_access_token',
        expires_in: 172800
      };

      nock('https://api.helpscout.net/v2')
        .post('/oauth2/token', {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials'
        })
        .reply(200, newTokens);
      jest.spyOn(axios, 'post');
      jest.spyOn(helpscout, 'emit');
      jest.spyOn(helpscout, 'finishRefreshingAccessToken');
      jest.spyOn(helpscout, 'setCredentials');
      jest.spyOn(helpscout, 'startRefreshingAccessToken');

      await expect(helpscout.refreshAccessToken()).resolves.toBeUndefined();
      expect(helpscout.startRefreshingAccessToken).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('https://api.helpscout.net/v2/oauth2/token', {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      });
      expect(helpscout.setCredentials).toHaveBeenCalledTimes(1);
      expect(helpscout.setCredentials).toHaveBeenCalledWith(newTokens);
      expect(helpscout.credentials).toEqual(newTokens);
      expect(helpscout.emit).toHaveBeenCalledTimes(1);
      expect(helpscout.emit).toHaveBeenCalledWith('tokens', newTokens);
      expect(helpscout.finishRefreshingAccessToken).toHaveBeenCalledTimes(1);
    });

    it('should refresh an access token using a refresh token when "OAuth2" flow is set', async () => {
      helpscout = new HelpScout({
        clientId,
        clientSecret,
        authenticationFlow: 'OAuth2'
      });

      expect(helpscout.credentials).toBeUndefined();

      const oldTokens = {
        refresh_token: 'old_refresh_token',
        token_type: 'bearer',
        access_token: 'old_access_token',
        expires_in: 172800
      };

      helpscout.setCredentials(oldTokens);

      expect(helpscout.credentials).toEqual(oldTokens);

      const newTokens = {
        refresh_token: 'new_refresh_token',
        token_type: 'bearer',
        access_token: 'new_access_token',
        expires_in: 172800
      };

      nock('https://api.helpscout.net/v2')
        .post('/oauth2/token', {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token: oldTokens.refresh_token
        })
        .reply(200, newTokens);
      jest.spyOn(axios, 'post');
      jest.spyOn(helpscout, 'emit');
      jest.spyOn(helpscout, 'finishRefreshingAccessToken');
      jest.spyOn(helpscout, 'setCredentials');
      jest.spyOn(helpscout, 'startRefreshingAccessToken');

      await expect(helpscout.refreshAccessToken()).resolves.toBeUndefined();
      expect(helpscout.startRefreshingAccessToken).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('https://api.helpscout.net/v2/oauth2/token', {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: oldTokens.refresh_token
      });
      expect(helpscout.setCredentials).toHaveBeenCalledTimes(1);
      expect(helpscout.setCredentials).toHaveBeenCalledWith(newTokens);
      expect(helpscout.credentials).toEqual(newTokens);
      expect(helpscout.emit).toHaveBeenCalledTimes(1);
      expect(helpscout.emit).toHaveBeenCalledWith('tokens', newTokens);
      expect(helpscout.finishRefreshingAccessToken).toHaveBeenCalledTimes(1);
    });

    it('should set "isRefreshingAccessTokenInProgress" to true when refreshing an access token was started', () => {
      helpscout.startRefreshingAccessToken();

      expect(helpscout.isRefreshingAccessTokenInProgress).toBe(true);
    });

    it('should set "isRefreshingAccessTokenInProgress" to false when refreshing an access token was finished', () => {
      helpscout.finishRefreshingAccessToken();

      expect(helpscout.isRefreshingAccessTokenInProgress).toBe(false);
    });

    it('should set credentials', () => {
      expect(helpscout.credentials).toBeUndefined();

      const tokens = {
        refresh_token: 'refresh_token',
        token_type: 'bearer',
        access_token: 'access_token',
        expires_in: 172800
      };

      helpscout.setCredentials(tokens);

      expect(helpscout.credentials).toEqual(tokens);
    });

    it('should handle a request', async () => {
      nock('https://api.helpscout.net/v2')
        .get('/get')
        .query(mockObject)
        .reply(200, mockObject);
      jest.spyOn(axios, 'request');

      const tokens = {
        refresh_token: 'refresh_token',
        token_type: 'bearer',
        access_token: 'access_token',
        expires_in: 172800
      };

      helpscout.setCredentials(tokens);

      const bottleneckOptions = {
        weight: 1
      };
      const requestOptions = {
        url: 'get',
        method: 'GET',
        params: mockObject
      };

      await helpscout.handleRequest(bottleneckOptions, requestOptions);

      expect(helpscout.bottleneck.schedule).toHaveBeenCalledTimes(1);
      expect(axios.request).toHaveBeenCalledTimes(1);
      expect(axios.request).toHaveBeenCalledWith({
        ...helpscout.requestOptions,
        headers: {
          common: {
            Authorization: `Bearer ${helpscout.credentials.access_token}`
          }
        },
        ...requestOptions
      });
    });

    it('should make a DELETE request', async () => {
      helpscout.handleRequest = jest.fn().mockImplementation(() => Promise.resolve(mockObject));

      await expect(helpscout.delete('delete')).resolves.toEqual(mockObject);
      expect(helpscout.handleRequest).toHaveBeenCalledTimes(1);
      expect(helpscout.handleRequest).toBeCalledWith(
        {
          weight: 2
        },
        {
          url: 'delete',
          method: 'DELETE'
        }
      );
    });

    it('should make a GET request', async () => {
      helpscout.handleRequest = jest.fn().mockImplementation(() => Promise.resolve(mockObject));

      await expect(helpscout.get('get', mockObject)).resolves.toEqual(mockObject);
      expect(helpscout.handleRequest).toHaveBeenCalledTimes(1);
      expect(helpscout.handleRequest).toBeCalledWith(
        {
          weight: 1
        },
        {
          url: 'get',
          method: 'GET',
          params: mockObject
        }
      );
    });

    it('should make a PATCH request', async () => {
      helpscout.handleRequest = jest.fn().mockImplementation(() => Promise.resolve(mockObject));

      await expect(helpscout.patch('patch', mockObject)).resolves.toEqual(mockObject);
      expect(helpscout.handleRequest).toHaveBeenCalledTimes(1);
      expect(helpscout.handleRequest).toBeCalledWith(
        {
          weight: 2
        },
        {
          url: 'patch',
          method: 'PATCH',
          data: mockObject
        }
      );
    });

    it('should make a POST request', async () => {
      helpscout.handleRequest = jest.fn().mockImplementation(() => Promise.resolve(mockObject));

      await expect(helpscout.post('post', mockObject)).resolves.toEqual(mockObject);
      expect(helpscout.handleRequest).toHaveBeenCalledTimes(1);
      expect(helpscout.handleRequest).toBeCalledWith(
        {
          weight: 2
        },
        {
          url: 'post',
          method: 'POST',
          data: mockObject
        }
      );
    });

    it('should make a PUT request', async () => {
      helpscout.handleRequest = jest.fn().mockImplementation(() => Promise.resolve(mockObject));

      await expect(helpscout.put('put', mockObject)).resolves.toEqual(mockObject);
      expect(helpscout.handleRequest).toHaveBeenCalledTimes(1);
      expect(helpscout.handleRequest).toBeCalledWith(
        {
          weight: 2
        },
        {
          url: 'put',
          method: 'PUT',
          data: mockObject
        }
      );
    });

    it('should successfully invoke the "nextPage" method', async () => {
      helpscout.handleRequest = jest.fn().mockImplementation(() => Promise.resolve(mockObject));

      await expect(helpscout.nextPage({
        next: {
          href: 'nextPage'
        }
      })).resolves.toEqual(mockObject);
      expect(helpscout.handleRequest).toHaveBeenCalledTimes(1);
      expect(helpscout.handleRequest).toBeCalledWith(
        {
          weight: 1
        },
        {
          url: 'nextPage',
          method: 'GET'
        }
      );
    });
  });
});
