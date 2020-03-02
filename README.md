# Node.js wrapper for Help Scout Mailbox API 2.0 [![Travis Build Status](https://img.shields.io/travis/turakvlad/helpscout-mailbox-api.svg)](https://travis-ci.org/turakvlad/helpscout-mailbox-api) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard) [![NPM Version](https://img.shields.io/npm/v/helpscout-mailbox-api.svg)](https://www.npmjs.com/package/helpscout-mailbox-api)

The Node.js wrapper for the [Help Scout Mailbox API 2.0](https://developer.helpscout.com/mailbox-api/). It supports the [OAuth 2.0](#oauth2-flow) and [Client Credentials](#client-credentials-flow) flows.

_Disclaimer: This module is not in any way affiliated to or supported by Help Scout Inc. It is provided as an open-source project under the [MIT](LICENSE) license._

- [Installation](#installation)
- [Authentication and authorization](#authentication-and-authorization)
  * [OAuth2 flow](#oauth2-flow)
    + [Creating an instance](#creating-an-instance)
    + [Generate an authorization URI](#generate-an-authorization-uri)
    + [Redirect back to your backend](#redirect-back-to-your-backend)
    + [Get access and refresh tokens](#get-access-and-refresh-tokens)
  * [Client Credentials flow](#client-credentials-flow)
    + [Creating an instance](#creating-an-instance-1)
    + [Get an access token](#get-an-access-token)
  * [Refresh tokens](#refresh-tokens)
- [Start using the library](#start-using-the-library)
  * [Set credentials](#set-credentials)
  * [Update requests options](#update-requests-options)
  * [Available methods](#available-methods)
    + [Conversations](#conversations)
      - [Attachments](#attachments)
      - [Custom Fields](#custom-fields)
      - [Tags](#tags)
      - [Threads](#threads)
    + [Customer properties](#customer-properties)
    + [Customers](#customers)
      - [Addresses](#addresses)
      - [Chat Handles](#chat-handles)
      - [Emails](#emails)
      - [Phones](#phones)
      - [Properties](#properties)
      - [Social Profiles](#social-profiles)
      - [Websites](#websites)
    + [Mailboxes](#mailboxes)
      - [Custom fields](#custom-fields)
      - [Folders](#folders)
    + [Ratings](#ratings)
    + [Reports](#reports)
      - [Company](#company)
      - [Conversation](#conversation)
      - [Docs](#docs)
      - [Happiness](#happiness)
      - [Productivity](#productivity)
      - [User](#user)
    + [Tags](#tags-1)
    + [Teams](#teams)
      - [Team members](#team-members)
    + [Users](#users)
    + [Webhooks](#webhooks)
    + [Workflows](#workflows)
- [Pagination](#pagination)
- [Rate limiting](#rate-limiting)
- [License](#license)

## Installation

This library is distributed via `npm`. To add it as a dependency, run the following command:

```
npm install helpscout-mailbox-api
```

## Authentication and authorization

There are two primary ways to authenticate to the Help Scout Mailbox 2.0 API:

- The **OAuth2** flow - is used for integrations to be used by other Help Scout users.
- The **Client Credentials** flow - is used for internal integrations.

Regardless of the flow you chose, you will have to [create an OAuth2 application](https://developer.helpscout.com/mailbox-api/overview/authentication/#oauth2-application) in your Help Scout's account at first. Please, do it before proceeding further.

### OAuth2 flow

This library can help you to implement the [OAuth2 flow](https://developer.helpscout.com/mailbox-api/overview/authentication/#authorization-code-flow). It allows you to generate an authorization URI, swap a code for tokens, refresh them when they are expired and many more.

#### Creating an instance

At first, you need to create an instance of the `HelpScout` class. `authenticationFlow` has to be set to `'OAuth2'`:

```javascript
const HelpScout = require('helpscout-mailbox-api');
const helpscout = new HelpScout({
    clientId: 'your_client_id',
    clientSecret: 'your_client_secret',
    authenticationFlow: 'OAuth2'
});
```

#### Generate an authorization URI

After creating an instance you can generate an authorization URI where a user should be redirected to authorize your application:

```javascript
const authorizeUri = helpscout.generateAuthorizationUri();
```

The function above will return a Help Scout authorization URI with your client ID appended as a query parameter. You should redirect your user to this URI. It will look like:

```
https://secure.helpscout.net/authentication/authorizeClientApplication?client_id=your_client_id
```

You can also pass a `state` as a parameter:

```javascript
const authorizeUri = helpscout.generateAuthorizationUri('your_secret');
```

In this case, you will get:

```
https://secure.helpscout.net/authentication/authorizeClientApplication?client_id=your_client_id&state=your_secret
```

#### Redirect back to your backend

After a user authorizes your application, Help Scout will redirect him/her back to a redirection URL that is defined in your app. A URI will contain a `code` query parameter and optionally a `state` parameter if it was passed earlier.

#### Get access and refresh tokens

To get access and refresh tokens you should:

```javascript
const tokens = await helpscout.getTokens(code);
```

You have to save these tokens somewhere in your database. You will need them later during setting the credentials. The tokens retrieved via the **OAuth2** flow have to be saved in order to complete the flow successfully. Keep in mind that you have to refresh the tokens when they are expired. Fortunately, the library does it for you out of the box. Read more about how refreshing tokens works [here](#refresh-tokens).

### Client Credentials flow

This library can help you to implement the [Client Credentials flow](https://developer.helpscout.com/mailbox-api/overview/authentication/#client-credentials-flow). It is much easier than the previous flow since it requires only a few simple steps.

#### Creating an instance

At first, you need to create an instance of the `HelpScout` class. `authenticationFlow` has to be set to `'clientCredentials'`:

```javascript
const HelpScout = require('helpscout-mailbox-api');
const helpscout = new HelpScout({
    clientId: 'your_application_id',
    clientSecret: 'your_application_secret',
    authenticationFlow: 'clientCredentials'
});
```

#### Get an access token

After creating an instance you can get an access token:

```javascript
const tokens = await helpscout.getTokens();
```

It would be better to save an access token in your database as well, but it is not required. The Help Scout [documentation](https://developer.helpscout.com/mailbox-api/overview/authentication/#response-2) says:

> This token is valid for 2 days and you should create a new one only after the existing token expires.

Frankly speaking, I tried to generate an access token using this flow a few times in a row and everything worked well. Maybe, Help Scout won't allow us to generate the new access token until the previous one expired in the future. In this case, you will have to save it.

However, I advise you to save an access token and replace the old one with the new one. It is more about security. It is better to have only one valid access token at a time and refresh it when it is expired rather than having dozens or even hundreds of valid access tokens. Read more about how refreshing tokens works [here](#refresh-tokens).

### Refresh tokens

You do not need to refresh tokens by yourself because the library does it for you under the hood. You should always store the latest tokens, and in order to do that the library is emitting a `tokens` event each time, it refreshes them. 

Keep in mind that you have to listen to this event if you use **OAuth2** flow. If the tokens were refreshed and you did not replace the old tokens with the new ones, your **OAuth2** flow will be broken since you have the old tokens and the old refresh token won't be longer valid because it has been already used. So, the library won't be able to refresh the tokens using the old refresh token. It is not the library's limitations, it is how the **OAuth2** flow works.

```javascript
helpscout.on('tokens', tokens => {
   // Save the new tokens somewhere in your database and use them next time.
});
```

The library refreshes tokens for both authentication flows. You do not need to run `helpscout.setCredentials(tokens)` with these new tokens. The library replaces them under the hood.

## Start using the library

### Set credentials

When you got your tokens either using **OAuth2** or **Client Credentials** flow, you should set credentials on the client in order to start using it. 

```javascript
helpscout.setCredentials(tokens);
```

From this point, you can start using the library. Please, see [the list of available methods](#available-methods) below.

### Update requests options

The library uses [Axios](https://www.npmjs.com/package/axios) to make requests. If you need to update Axios options you can use this method:

```javascript
helpscout.updateRequestOptions({
   // pass any new options here. 
});
```

Please, update the Axios options only in case if you know what you are doing. Be aware that Axios `baseUrl` option can not be updated.

### Available methods

Each method returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). So, you are free to use promises or async/await styles. The library does not support a callback style at the moment. If you really need it, please create a feature request and I will see what I can do.

A promise resolves with an Axios [response schema](https://www.npmjs.com/package/axios#response-schema) and rejects with an Axios [error schema](https://www.npmjs.com/package/axios#handling-errors). 

In all the methods below, a `params` parameter is optional.

#### Conversations

The following methods are available on the `helpscout.conversations` object: [`create`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/create/), [`delete`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/delete/), [`get`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/get/), [`list`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/list/), [`update`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/update/).

```javascript
helpscout.conversations.create(data);
helpscout.conversations.delete(conversationId);
helpscout.conversations.get(conversationId, params);
helpscout.conversations.list(params);
helpscout.conversations.update(conversationId, data);
```

##### Attachments

The following methods are available on the `helpscout.conversations.attachments` object: [`delete`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/attachments/create/), [`getData`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/attachments/get-data/), [`upload`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/attachments/delete/).

```javascript
helpscout.conversations.attachments.delete(conversationId, attachmentId);
helpscout.conversations.attachments.getData(conversationId, attachmentId);
helpscout.conversations.attachments.upload(conversationId, attachmentId, data);
```

##### Custom Fields

The following methods are available on the `helpscout.conversations.customFields` object: [`update`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/custom_fields/update/).

```javascript
helpscout.conversations.customFields.update(conversationId, data);
```

##### Tags

The following methods are available on the `helpscout.conversations.tags` object: [`update`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/tags/update/).

```javascript
helpscout.conversations.tags.update(conversationId, data);
```

##### Threads

The following methods are available on the `helpscout.conversations.threads` object: [`createChat`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/chat/), [`createCustomer`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/customer/), [`createNote`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/note/), [`createPhone`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/phone/), [`createReply`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/reply/), [`get`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/thread-source-json/), [`list`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/list/), [`update`](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/update/).

```javascript
helpscout.conversations.threads.createChat(conversationId, data);
helpscout.conversations.threads.createCustomer(conversationId, data);
helpscout.conversations.threads.createNote(conversationId, data);
helpscout.conversations.threads.createPhone(conversationId, data);
helpscout.conversations.threads.createReply(conversationId, data);
helpscout.conversations.threads.get(onversationId, threadId);
helpscout.conversations.threads.list(conversationId, params);
helpscout.conversations.threads.update(conversationId, threadId, data);
```

#### Customer properties

The following methods are available on the `helpscout.customerProperties` object: [`list`](https://developer.helpscout.com/mailbox-api/endpoints/customer_properties/list/).

```
helpscout.customerProperties.list(params);
```

#### Customers

The following methods are available on the `helpscout.customers` object: [`create`](https://developer.helpscout.com/mailbox-api/endpoints/customers/create/), [`get`](https://developer.helpscout.com/mailbox-api/endpoints/customers/get/), [`list`](https://developer.helpscout.com/mailbox-api/endpoints/customers/list/), [`overwrite`](https://developer.helpscout.com/mailbox-api/endpoints/customers/overwrite/), [`update`](https://developer.helpscout.com/mailbox-api/endpoints/customers/update/).

```javascript
helpscout.customers.create(data);
helpscout.customers.get(customerId, params);
helpscout.customers.list(params);
helpscout.customers.overwrite(customerId, data);
helpscout.customers.update(customerId, data);
```

##### Addresses

The following methods are available on the `helpscout.customers.addresses` object: [`create`](https://developer.helpscout.com/mailbox-api/endpoints/customers/address/create/), [`delete`](https://developer.helpscout.com/mailbox-api/endpoints/customers/address/delete/), [`get`](https://developer.helpscout.com/mailbox-api/endpoints/customers/address/get/), [`update`](https://developer.helpscout.com/mailbox-api/endpoints/customers/address/update/).

```javascript
helpscout.customers.addresses.create(customerId, data);
helpscout.customers.addresses.delete(customerId);
helpscout.customers.addresses.get(customerId);
helpscout.customers.addresses.update(customerId, data);
```

##### Chat Handles

The following methods are available on the `helpscout.customers.chatHandles` object: [`create`](https://developer.helpscout.com/mailbox-api/endpoints/customers/chat_handles/create/), [`delete`](https://developer.helpscout.com/mailbox-api/endpoints/customers/chat_handles/delete/), [`list`](https://developer.helpscout.com/mailbox-api/endpoints/customers/chat_handles/list/), [`update`](https://developer.helpscout.com/mailbox-api/endpoints/customers/chat_handles/update/).

```javascript
helpscout.customers.chatHandles.create(customerId, data);
helpscout.customers.chatHandles.delete(customerId, chatId);
helpscout.customers.chatHandles.list(customerId, params);
helpscout.customers.chatHandles.update(customerId, chatId, data);
```

##### Emails

The following methods are available on the `helpscout.customers.emails` object: [`create`](https://developer.helpscout.com/mailbox-api/endpoints/customers/emails/create/), [`delete`](https://developer.helpscout.com/mailbox-api/endpoints/customers/emails/delete/), [`list`](https://developer.helpscout.com/mailbox-api/endpoints/customers/emails/list/), [`update`](https://developer.helpscout.com/mailbox-api/endpoints/customers/emails/update/).

```javascript
helpscout.customers.emails.create(customerId, data);
helpscout.customers.emails.delete(customerId, emailId);
helpscout.customers.emails.list(customerId, params);
helpscout.customers.emails.update(customerId, emailId, data);
```

##### Phones

The following methods are available on the `helpscout.customers.phones` object: [`create`](https://developer.helpscout.com/mailbox-api/endpoints/customers/phones/create/), [`delete`](https://developer.helpscout.com/mailbox-api/endpoints/customers/phones/delete/), [`list`](https://developer.helpscout.com/mailbox-api/endpoints/customers/phones/list/), [`update`](https://developer.helpscout.com/mailbox-api/endpoints/customers/phones/update/).

```javascript
helpscout.customers.phones.create(customerId, data);
helpscout.customers.phones.delete(customerId, phoneId);
helpscout.customers.phones.list(customerId, params);
helpscout.customers.phones.update(customerId, phoneId, data);
```

##### Properties

The following methods are available on the `helpscout.customers.properties` object: [`update`](https://developer.helpscout.com/mailbox-api/endpoints/customers/properties/update/).

```javascript
helpscout.customers.properties.update(customerId, data);
```

##### Social Profiles

The following methods are available on the `helpscout.customers.socialProfiles` object: [`create`](https://developer.helpscout.com/mailbox-api/endpoints/customers/social_profiles/create/), [`delete`](https://developer.helpscout.com/mailbox-api/endpoints/customers/social_profiles/delete/), [`list`](https://developer.helpscout.com/mailbox-api/endpoints/customers/social_profiles/list/), [`update`](https://developer.helpscout.com/mailbox-api/endpoints/customers/social_profiles/update/).

```javascript
helpscout.customers.socialProfiles.create(customerId, data);
helpscout.customers.socialProfiles.delete(customerId, socialProfileId);
helpscout.customers.socialProfiles.list(customerId, params);
helpscout.customers.socialProfiles.update(customerId, socialProfileId, data);
```

##### Websites

The following methods are available on the `helpscout.customers.websites` object: [`create`](https://developer.helpscout.com/mailbox-api/endpoints/customers/websites/create/), [`delete`](https://developer.helpscout.com/mailbox-api/endpoints/customers/websites/delete/), [`list`](https://developer.helpscout.com/mailbox-api/endpoints/customers/websites/list/), [`update`](https://developer.helpscout.com/mailbox-api/endpoints/customers/websites/update/).

```javascript
helpscout.customers.websites.create(customerId, data);
helpscout.customers.websites.delete(customerId, websiteId);
helpscout.customers.websites.list(customerId, params);
helpscout.customers.websites.update(customerId, websiteId, data);
```

#### Mailboxes

The following methods are available on the `helpscout.mailboxes` object: [`get`](https://developer.helpscout.com/mailbox-api/endpoints/mailboxes/get/), [`list`](https://developer.helpscout.com/mailbox-api/endpoints/mailboxes/list/).

```javascript
helpscout.mailboxes.get(mailboxId);
helpscout.mailboxes.list(params);
```

##### Custom fields

The following methods are available on the `helpscout.mailboxes.customFields` object: [`list`](https://developer.helpscout.com/mailbox-api/endpoints/mailboxes/mailbox-fields/).

```javascript
helpscout.mailboxes.customFields.list(mailboxId, params);
```

##### Folders

The following methods are available on the `helpscout.mailboxes.folders` object: [`list`](https://developer.helpscout.com/mailbox-api/endpoints/mailboxes/mailbox-folders/).

```javascript
helpscout.mailboxes.folders.list(mailboxId, params);
```

#### Ratings

The following methods are available on the `helpscout.ratings` object: [`get`](https://developer.helpscout.com/mailbox-api/endpoints/ratings/get/).

```javascript
helpscout.ratings.get(ratingId);
```

#### Reports

The following methods are available on the `helpscout.reports` object: [`getChatReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/chat/), [`getEmailReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/email/), [`getPhoneReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/phone/).

```javascript
helpscout.reports.getChatReport(params);
helpscout.reports.getEmailReport(params);
helpscout.reports.getPhoneReport(params);
```

##### Company

The following methods are available on the `helpscout.reports.company` object: [`getOverallReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/company/reports-company-overall/), [`getCustomersHelpedReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/company/reports-company-customers-helped/), [`getDrilldownReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/company/reports-company-drilldown/).

```javascript
helpscout.reports.company.getOverallReport(params);
helpscout.reports.company.getCustomersHelpedReport(params);
helpscout.reports.company.getDrilldownReport(params);
```

##### Conversation

The following methods are available on the `helpscout.reports.conversation` object: [`getOverallReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/conversations/reports-conversations-overall/), [`getVolumesByChannelReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/conversations/reports-conversations-volume-by-channel/), [`getBusiesTimeOfDayReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/conversations/reports-conversations-busy-times/), [`getDrilldownReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/conversations/reports-conversations-drilldown/), [`getDrilldownByFieldReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/conversations/reports-conversations-field-drilldown/), [`getNewConversationsReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/conversations/reports-conversations-new/), [`getNewConversationsDrilldownReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/conversations/reports-conversations-new-drilldown/), [`getReceivedMessagesReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/conversations/reports-conversations-received-messages/).

```javascript
helpscout.reports.conversation.getOverallReport(params);
helpscout.reports.conversation.getVolumesByChannelReport(params);
helpscout.reports.conversation.getBusiesTimeOfDayReport(params);
helpscout.reports.conversation.getDrilldownReport(params);
helpscout.reports.conversation.getDrilldownByFieldReport(params);
helpscout.reports.conversation.getNewConversationsReport(params);
helpscout.reports.conversation.getNewConversationsDrilldownReport(params);
helpscout.reports.conversation.getReceivedMessagesReport(params);
```

##### Docs

The following methods are available on the `helpscout.reports.docs` object: [`getOverallReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/docs/reports-docs-overall/).

```javascript
helpscout.reports.docs.getOverallReport(params);
```

##### Happiness

The following methods are available on the `helpscout.reports.happiness` object: [`getOverallReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/happiness/reports-happiness-overall/), [`getRatingsReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/happiness/reports-happiness-ratings/).

```javascript
helpscout.reports.happiness.getOverallReport(params);
helpscout.reports.happiness.getRatingsReport(params);)
```

##### Productivity

The following methods are available on the `helpscout.reports.productivity` object: [`getOverallReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/productivity/reports-productivity-overall/), [`getFirstResponseTimeReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/productivity/reports-productivity-first-response-time/), [`getRepliesSentReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/productivity/reports-productivity-replies-sent/), [`getResolutionTimeReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/productivity/reports-productivity-resolution-time/), [`getResolvedReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/productivity/reports-productivity-resolved/), [`getResponseTimeReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/productivity/reports-productivity-respose-time/).

```javascript
helpscout.reports.productivity.getOverallReport(params);
helpscout.reports.productivity.getFirstResponseTimeReport(params);
helpscout.reports.productivity.getRepliesSentReport(params);
helpscout.reports.productivity.getResolutionTimeReport(params);
helpscout.reports.productivity.getResolvedReport(params);
helpscout.reports.productivity.getResponseTimeReport(params);
```

##### User

The following methods are available on the `helpscout.reports.user` object: [`getOverallReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/user/reports-user/), [`getConversationHistoryReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/user/reports-user-conversation-history/), [`getCustomersHelpedReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/user/reports-user-customer-helped/), [`getDrilldownReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/user/reports-user-drilldown/), [`getHappinessReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/user/reports-user-happiness/), [`getHappinessDrilldownReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/user/reports-user-happiness-drilldown/), [`getRepliesReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/user/reports-user-replies/), [`getResolutionsReport`](https://developer.helpscout.com/mailbox-api/endpoints/reports/user/reports-user-resolutions/).

```javascript
helpscout.reports.user.getOverallReport(params);
helpscout.reports.user.getConversationHistoryReport(params);
helpscout.reports.user.getCustomersHelpedReport(params);
helpscout.reports.user.getDrilldownReport(params);
helpscout.reports.user.getHappinessReport(params);
helpscout.reports.user.getHappinessDrilldownReport(params);
helpscout.reports.user.getRepliesReport(params);
helpscout.reports.user.getResolutionsReport(params);
```

#### Tags

The following methods are available on the `helpscout.tags` object: [`list`](https://developer.helpscout.com/mailbox-api/endpoints/tags/list/).

```javascript
helpscout.tags.list(params);
```

#### Teams

The following methods are available on the `helpscout.teams` object: [`list`](https://developer.helpscout.com/mailbox-api/endpoints/teams/list-teams/).

```javascript
helpscout.teams.list(params);
```

##### Team members

The following methods are available on the `helpscout.teams.teamMembers` object: [`list`](https://developer.helpscout.com/mailbox-api/endpoints/teams/list-team-members/).

```javascript
helpscout.teams.teamMembers.list(teamId, params);
```

#### Users

The following methods are available on the `helpscout.users` object: [`get`](https://developer.helpscout.com/mailbox-api/endpoints/users/get/), [`list`](https://developer.helpscout.com/mailbox-api/endpoints/users/list/), [`me`](https://developer.helpscout.com/mailbox-api/endpoints/users/me/).

```javascript
helpscout.users.get(userId);
helpscout.users.list(params);
helpscout.users.me();
```

#### Webhooks

The following methods are available on the `helpscout.webhooks` object: [`create`](https://developer.helpscout.com/mailbox-api/endpoints/webhooks/create/), [`delete`](https://developer.helpscout.com/mailbox-api/endpoints/webhooks/delete/), [`get`](https://developer.helpscout.com/mailbox-api/endpoints/webhooks/get/), [`list`](https://developer.helpscout.com/mailbox-api/endpoints/webhooks/list/), [`update`](https://developer.helpscout.com/mailbox-api/endpoints/webhooks/update/).

```javascript
helpscout.webhooks.create(data);
helpscout.webhooks.delete(webhookId);
helpscout.webhooks.get(webhookId);
helpscout.webhooks.list(params);
helpscout.webhooks.update(webhookId, data);
```

#### Workflows

The following methods are available on the `helpscout.workflows` object: [`list`](https://developer.helpscout.com/mailbox-api/endpoints/workflows/list/), [`runManual`](https://developer.helpscout.com/mailbox-api/endpoints/workflows/run/), [`update`](https://developer.helpscout.com/mailbox-api/endpoints/workflows/update/).

```javascript
helpscout.workflows.list(params);
helpscout.workflows.runManual(workflowId, data);
helpscout.workflows.update(workflowId, data);
```

## Pagination

The client exposes a useful method for getting the next page's results:

```javascript
const firstPageResults = await helpscout.conversations.list();
const { _embedded, _links, page } = firstPageResults;

if (_links.next) {
    const secondPageResults = await helpscout.nextPage(_links);
}
```

You can write a recursion function to get, for example, all the conversations or customers using this method.

## Rate limiting

The library uses the great [Bottleneck](https://www.npmjs.com/package/bottleneck) library in order to implement a [Help Scout rate-limiting policy](https://developer.helpscout.com/mailbox-api/overview/rate-limiting/). 

> Requests are limited to 400 requests per minute per account. All users associated with the same account count against the same minute rate limit. Response code 429 is returned when the throttle limit has been reached. Write requests (`POST`, `PUT`, `DELETE`, `PATCH`) count as 2 requests toward the rate limit._

This means that we can make 400 `GET` or only 200 write requests per minute, or 300 `GET` and 50 write ones. I hope you got the idea.

The default Bottleneck options are:

```javascript
{
    maxConcurrent: 2,
    minTime: 125,
    reservoir: 400,
    reservoirRefreshAmount: 400,
    reservoirRefreshInterval: 60 * 1000
}
```

The library uses `weight` of 2 as a [job option](https://www.npmjs.com/package/bottleneck#job-options) for write requests (`POST`, `PUT`, `DELETE`, `PATCH`) since Help Scout counts them as _2 requests toward the rate limit_.

You can update the Bottleneck options using this method:

```javascript
helpscout.updateBottleneckOptions({
    // pass any new options here.
});
```

Under the hood, the library will execute the Bottleneck [`updateSettings`](https://www.npmjs.com/package/bottleneck#updatesettings) method. Please, update the Bottleneck options only in case if you know what you are doing.

## License

[MIT](LICENSE)
