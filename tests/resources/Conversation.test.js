'use strict';

const HelpScout = require('../../src/index');
const Attachment = require('../../src/resources/Conversation/Attachment');
const CustomField = require('../../src/resources/Conversation/CustomField');
const Tag = require('../../src/resources/Conversation/Tag');
const Thread = require('../../src/resources/Conversation/Thread');
const nock = require('nock');

describe('Conversation.js', () => {
  const clientId = 'clientId';
  const clientSecret = 'clientSecret';
  const mockObject = {
    prop: 'value'
  };
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
    expect(helpscout.conversations.client).toEqual(helpscout);
  });

  it('should be an instance of an Attachment class', () => {
    expect(helpscout.conversations.attachments).toBeInstanceOf(Attachment);
  });

  it('should be an instance of a CustomField class', () => {
    expect(helpscout.conversations.customFields).toBeInstanceOf(CustomField);
  });

  it('should be an instance of a Tag class', () => {
    expect(helpscout.conversations.tags).toBeInstanceOf(Tag);
  });

  it('should be an instance of a Thread class', () => {
    expect(helpscout.conversations.threads).toBeInstanceOf(Thread);
  });

  it('should create a conversation', async () => {
    nock('https://api.helpscout.net/v2')
      .post('/conversations', mockObject)
      .reply(201, '');
    jest.spyOn(helpscout.conversations, 'create');
    jest.spyOn(helpscout, 'post');

    await helpscout.conversations.create(mockObject);

    expect(helpscout.conversations.create).toHaveBeenCalledTimes(1);
    expect(helpscout.conversations.create).toHaveBeenCalledWith(mockObject);
    expect(helpscout.post).toHaveBeenCalledTimes(1);
    expect(helpscout.post).toHaveBeenCalledWith('conversations', mockObject);
  });

  it('should delete a conversation', async () => {
    const conversationId = 123;

    nock('https://api.helpscout.net/v2')
      .delete(`/conversations/${conversationId}`)
      .reply(204, '');
    jest.spyOn(helpscout.conversations, 'delete');
    jest.spyOn(helpscout, 'delete');

    await helpscout.conversations.delete(conversationId);

    expect(helpscout.conversations.delete).toHaveBeenCalledTimes(1);
    expect(helpscout.conversations.delete).toHaveBeenCalledWith(conversationId);
    expect(helpscout.delete).toHaveBeenCalledTimes(1);
    expect(helpscout.delete).toHaveBeenCalledWith(`conversations/${conversationId}`);
  });

  it('should get a conversation', async () => {
    const conversationId = 123;

    nock('https://api.helpscout.net/v2')
      .get(`/conversations/${conversationId}`)
      .query(mockObject)
      .reply(200, mockObject);
    jest.spyOn(helpscout.conversations, 'get');
    jest.spyOn(helpscout, 'get');

    await helpscout.conversations.get(123, mockObject);

    expect(helpscout.conversations.get).toHaveBeenCalledTimes(1);
    expect(helpscout.conversations.get).toHaveBeenCalledWith(123, mockObject);
    expect(helpscout.get).toHaveBeenCalledTimes(1);
    expect(helpscout.get).toHaveBeenCalledWith(`conversations/${conversationId}`, mockObject);
  });

  it('should list conversations', async () => {
    nock('https://api.helpscout.net/v2')
      .get('/conversations')
      .query(mockObject)
      .reply(200, mockObject);
    jest.spyOn(helpscout.conversations, 'list');
    jest.spyOn(helpscout, 'get');

    await helpscout.conversations.list(mockObject);

    expect(helpscout.conversations.list).toHaveBeenCalledTimes(1);
    expect(helpscout.conversations.list).toHaveBeenCalledWith(mockObject);
    expect(helpscout.get).toHaveBeenCalledTimes(1);
    expect(helpscout.get).toHaveBeenCalledWith('conversations', mockObject);
  });

  it('should update a conversation', async () => {
    const conversationId = 123;

    nock('https://api.helpscout.net/v2')
      .patch(`/conversations/${conversationId}`, mockObject)
      .reply(204, '');
    jest.spyOn(helpscout.conversations, 'update');
    jest.spyOn(helpscout, 'patch');

    await helpscout.conversations.update(conversationId, mockObject);

    expect(helpscout.conversations.update).toHaveBeenCalledTimes(1);
    expect(helpscout.conversations.update).toHaveBeenCalledWith(conversationId, mockObject);
    expect(helpscout.patch).toHaveBeenCalledTimes(1);
    expect(helpscout.patch).toHaveBeenCalledWith(`conversations/${conversationId}`, mockObject);
  });

  describe('Attachment.js', () => {
    it('should delete an attachment', async () => {
      const conversationId = 123;
      const attachmentId = 456;

      nock('https://api.helpscout.net/v2')
        .delete(`/conversations/${conversationId}/attachments/${attachmentId}`)
        .reply(204, '');
      jest.spyOn(helpscout.conversations.attachments, 'delete');
      jest.spyOn(helpscout, 'delete');

      await helpscout.conversations.attachments.delete(conversationId, attachmentId);

      expect(helpscout.conversations.attachments.delete).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.attachments.delete).toHaveBeenCalledWith(conversationId, attachmentId);
      expect(helpscout.delete).toHaveBeenCalledTimes(1);
      expect(helpscout.delete).toHaveBeenCalledWith(`conversations/${conversationId}/attachments/${attachmentId}`);
    });

    it('should get the attachment\'s data', async () => {
      const conversationId = 123;
      const attachmentId = 456;

      nock('https://api.helpscout.net/v2')
        .get(`/conversations/${conversationId}/attachments/${attachmentId}/data`)
        .reply(200, mockObject);
      jest.spyOn(helpscout.conversations.attachments, 'getData');
      jest.spyOn(helpscout, 'get');

      await helpscout.conversations.attachments.getData(conversationId, attachmentId);

      expect(helpscout.conversations.attachments.getData).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.attachments.getData).toHaveBeenCalledWith(conversationId, attachmentId);
      expect(helpscout.get).toHaveBeenCalledTimes(1);
      expect(helpscout.get).toHaveBeenCalledWith(`conversations/${conversationId}/attachments/${attachmentId}/data`);
    });

    it('should upload an attachment', async () => {
      const conversationId = 123;
      const attachmentId = 456;

      nock('https://api.helpscout.net/v2')
        .post(`/conversations/${conversationId}/threads/${attachmentId}/attachments`, mockObject)
        .reply(201, '');
      jest.spyOn(helpscout.conversations.attachments, 'upload');
      jest.spyOn(helpscout, 'post');

      await helpscout.conversations.attachments.upload(conversationId, attachmentId, mockObject);

      expect(helpscout.conversations.attachments.upload).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.attachments.upload).toHaveBeenCalledWith(conversationId, attachmentId, mockObject);
      expect(helpscout.post).toHaveBeenCalledTimes(1);
      expect(helpscout.post).toHaveBeenCalledWith(`conversations/${conversationId}/threads/${attachmentId}/attachments`, mockObject);
    });
  });

  describe('CustomField.js', () => {
    it('should update a custom field', async () => {
      const conversationId = 123;

      nock('https://api.helpscout.net/v2')
        .put(`/conversations/${conversationId}/fields`, mockObject)
        .reply(204, '');
      jest.spyOn(helpscout.conversations.customFields, 'update');
      jest.spyOn(helpscout, 'put');

      await helpscout.conversations.customFields.update(conversationId, mockObject);

      expect(helpscout.conversations.customFields.update).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.customFields.update).toHaveBeenCalledWith(conversationId, mockObject);
      expect(helpscout.put).toHaveBeenCalledTimes(1);
      expect(helpscout.put).toHaveBeenCalledWith(`conversations/${conversationId}/fields`, mockObject);
    });
  });

  describe('Tag.js', () => {
    it('should update a tag', async () => {
      const conversationId = 123;

      nock('https://api.helpscout.net/v2')
        .put(`/conversations/${conversationId}/tags`, mockObject)
        .reply(204, '');
      jest.spyOn(helpscout.conversations.tags, 'update');
      jest.spyOn(helpscout, 'put');

      await helpscout.conversations.tags.update(conversationId, mockObject);

      expect(helpscout.conversations.tags.update).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.tags.update).toHaveBeenCalledWith(conversationId, mockObject);
      expect(helpscout.put).toHaveBeenCalledTimes(1);
      expect(helpscout.put).toHaveBeenCalledWith(`conversations/${conversationId}/tags`, mockObject);
    });
  });

  describe('Thread.js', () => {
    it('should create a chat thread', async () => {
      const conversationId = 123;

      nock('https://api.helpscout.net/v2')
        .post(`/conversations/${conversationId}/chats`, mockObject)
        .reply(201, '');
      jest.spyOn(helpscout.conversations.threads, 'createChat');
      jest.spyOn(helpscout, 'post');

      await helpscout.conversations.threads.createChat(conversationId, mockObject);

      expect(helpscout.conversations.threads.createChat).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.threads.createChat).toHaveBeenCalledWith(conversationId, mockObject);
      expect(helpscout.post).toHaveBeenCalledTimes(1);
      expect(helpscout.post).toHaveBeenCalledWith(`conversations/${conversationId}/chats`, mockObject);
    });

    it('should create a customer thread', async () => {
      const conversationId = 123;

      nock('https://api.helpscout.net/v2')
        .post(`/conversations/${conversationId}/customer`, mockObject)
        .reply(201, '');
      jest.spyOn(helpscout.conversations.threads, 'createCustomer');
      jest.spyOn(helpscout, 'post');

      await helpscout.conversations.threads.createCustomer(conversationId, mockObject);

      expect(helpscout.conversations.threads.createCustomer).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.threads.createCustomer).toHaveBeenCalledWith(conversationId, mockObject);
      expect(helpscout.post).toHaveBeenCalledTimes(1);
      expect(helpscout.post).toHaveBeenCalledWith(`conversations/${conversationId}/customer`, mockObject);
    });

    it('should create a note thread', async () => {
      const conversationId = 123;

      nock('https://api.helpscout.net/v2')
        .post(`/conversations/${conversationId}/notes`, mockObject)
        .reply(201, '');
      jest.spyOn(helpscout.conversations.threads, 'createNote');
      jest.spyOn(helpscout, 'post');

      await helpscout.conversations.threads.createNote(conversationId, mockObject);

      expect(helpscout.conversations.threads.createNote).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.threads.createNote).toHaveBeenCalledWith(conversationId, mockObject);
      expect(helpscout.post).toHaveBeenCalledTimes(1);
      expect(helpscout.post).toHaveBeenCalledWith(`conversations/${conversationId}/notes`, mockObject);
    });

    it('should create a phone thread', async () => {
      const conversationId = 123;

      nock('https://api.helpscout.net/v2')
        .post(`/conversations/${conversationId}/phones`, mockObject)
        .reply(201, '');
      jest.spyOn(helpscout.conversations.threads, 'createPhone');
      jest.spyOn(helpscout, 'post');

      await helpscout.conversations.threads.createPhone(conversationId, mockObject);

      expect(helpscout.conversations.threads.createPhone).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.threads.createPhone).toHaveBeenCalledWith(conversationId, mockObject);
      expect(helpscout.post).toHaveBeenCalledTimes(1);
      expect(helpscout.post).toHaveBeenCalledWith(`conversations/${conversationId}/phones`, mockObject);
    });

    it('should create a reply thread', async () => {
      const conversationId = 123;

      nock('https://api.helpscout.net/v2')
        .post(`/conversations/${conversationId}/reply`, mockObject)
        .reply(201, '');
      jest.spyOn(helpscout.conversations.threads, 'createReply');
      jest.spyOn(helpscout, 'post');

      await helpscout.conversations.threads.createReply(conversationId, mockObject);

      expect(helpscout.conversations.threads.createReply).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.threads.createReply).toHaveBeenCalledWith(conversationId, mockObject);
      expect(helpscout.post).toHaveBeenCalledTimes(1);
      expect(helpscout.post).toHaveBeenCalledWith(`conversations/${conversationId}/reply`, mockObject);
    });

    it('should get a thread', async () => {
      const conversationId = 123;
      const threadId = 456;

      nock('https://api.helpscout.net/v2')
        .get(`/conversations/${conversationId}/threads/${threadId}/original-source`)
        .reply(200, mockObject);
      jest.spyOn(helpscout.conversations.threads, 'get');
      jest.spyOn(helpscout, 'get');

      await helpscout.conversations.threads.get(conversationId, threadId);

      expect(helpscout.conversations.threads.get).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.threads.get).toHaveBeenCalledWith(conversationId, threadId);
      expect(helpscout.get).toHaveBeenCalledTimes(1);
      expect(helpscout.get).toHaveBeenCalledWith(`conversations/${conversationId}/threads/${threadId}/original-source`);
    });

    it('should list threads', async () => {
      const conversationId = 123;

      nock('https://api.helpscout.net/v2')
        .get(`/conversations/${conversationId}/threads`)
        .query(mockObject)
        .reply(200, mockObject);
      jest.spyOn(helpscout.conversations.threads, 'list');
      jest.spyOn(helpscout, 'get');

      await helpscout.conversations.threads.list(conversationId, mockObject);

      expect(helpscout.conversations.threads.list).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.threads.list).toHaveBeenCalledWith(conversationId, mockObject);
      expect(helpscout.get).toHaveBeenCalledTimes(1);
      expect(helpscout.get).toHaveBeenCalledWith(`conversations/${conversationId}/threads`, mockObject);
    });

    it('should update a thread', async () => {
      const conversationId = 123;
      const threadId = 456;

      nock('https://api.helpscout.net/v2')
        .patch(`/conversations/${conversationId}/threads/${threadId}`, mockObject)
        .reply(204, '');
      jest.spyOn(helpscout.conversations.threads, 'update');
      jest.spyOn(helpscout, 'patch');

      await helpscout.conversations.threads.update(conversationId, threadId, mockObject);

      expect(helpscout.conversations.threads.update).toHaveBeenCalledTimes(1);
      expect(helpscout.conversations.threads.update).toHaveBeenCalledWith(conversationId, threadId, mockObject);
      expect(helpscout.patch).toHaveBeenCalledTimes(1);
      expect(helpscout.patch).toHaveBeenCalledWith(`conversations/${conversationId}/threads/${threadId}`, mockObject);
    });
  });
});
