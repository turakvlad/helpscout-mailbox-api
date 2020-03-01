'use strict';

const HelpScout = require('../../src/index');

describe('Webhook.js', () => {
  const clientId = 'clientId';
  const clientSecret = 'clientSecret';
  let helpscout;

  beforeEach(() => {
    helpscout = new HelpScout({
      clientId,
      clientSecret,
      authenticationFlow: 'clientCredentials'
    });
    helpscout.setCredentials({
      refresh_token: 'refresh_token',
      token_type: 'bearer',
      access_token: 'access_token',
      expires_in: 172800
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be equal to a Help Scout instance itself', () => {
    expect(helpscout.webhooks.client).toEqual(helpscout);
  });
});
