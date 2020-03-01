'use strict';

const HelpScout = require('../index');

(async () => {
  const helpscout = new HelpScout({
    clientId: '1pHgevutkI81fdl0J0Y0xXLslu6fxqtL', clientSecret: 'mW0XWJcdvqoX1sIRufT9jCuilLNDIJUV', authenticationFlow: 'clientCredentials'
  });
  // helpscout.setCredentials({ refresh_token: 'jVCpMID603P0P9wWTlAUmJLnaFBmSZ1z',
  //   token_type: 'bearer',
  //   access_token: 'JA68t893mXMqiP1ccTw2raZRuddLMUlR',
  //   expires_in: 172800 });
  const tokens = await helpscout.getTokens();

  console.log(tokens);
  helpscout.setCredentials(tokens);
  helpscout.on('tokens', console.log);

  // const data = await helpscout.conversations.create(
  //   {
  //     "subject" : "Subject",
  //     "customer" : {
  //       "email" : "bear@acme.com",
  //       "firstName" : "Vernon",
  //       "lastName" : "Bear"
  //     },
  //     "mailboxId" : 209633,
  //     "type" : "email",
  //     "status" : "active",
  //     "createdAt" : "2012-10-10T12:00:00Z",
  //     "threads" : [ {
  //       "type" : "customer",
  //       "customer" : {
  //         "email" : "bear@acme.com"
  //       },
  //       "text" : "Hello, Help Scout. How are you?"
  //     } ],
  //     "tags" : [ "vip" ],
  //     "fields" : [ {
  //       "id" : 531,
  //       "value" : "trial"
  //     } ]
  //   });

  const data = await helpscout.conversations.get(1093150492);
  console.log(data);

  // helpscout.reports.user.getOverallReport();
  // const conversations = await helpscout.conversations.list();

  // console.log(conversations);
})().catch(err => {
  console.log(err);
  // console.log(err.response.data._embedded);
});
