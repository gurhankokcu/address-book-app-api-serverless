'use strict'

describe('contacts controller', () => {
  const mockModels = {
    Contact: {
      findAll: () => {},
      findByPk: () => {},
      create: () => {}
    }
  }

  beforeEach(() => {
    jest.mock('../../models', () => mockModels)
  })

  describe('list contacts', () => {
    const contactsData = [{
      id: 1,
      name: 'Name 1'
    }, {
      id: 2,
      name: 'Name 2'
    }]
    const mockEvent = { queryStringParameters: {} }

    beforeEach(() => {
      jest.mock('config', () => ({
        get: jest.fn().mockImplementation((key) => key === 'pagesize' ? 5 : 99)
      }))
      jest.spyOn(mockModels.Contact, 'findAll').mockImplementation(() => contactsData)
      mockEvent.queryStringParameters = {}
    })

    it('should return all contacts', async () => {
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(actualResult.statusCode).toBe(200)
      expect(JSON.parse(actualResult.body)).toEqual(contactsData)
    })

    it('should return 1st page if querystringparameters is not defined', async () => {
      delete mockEvent.queryStringParameters
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(mockModels.Contact.findAll.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findAll.mock.calls[0][0].offset).toBe(0)
      expect(mockModels.Contact.findAll.mock.calls[0][0].limit).toBe(5)
      expect(actualResult.statusCode).toBe(200)
    })

    it('should return 1st page if page is not specified', async () => {
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(mockModels.Contact.findAll.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findAll.mock.calls[0][0].offset).toBe(0)
      expect(mockModels.Contact.findAll.mock.calls[0][0].limit).toBe(5)
      expect(actualResult.statusCode).toBe(200)
    })

    it('should return error if page is not a positive number', async () => {
      mockEvent.queryStringParameters.page = -5
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('page')
    })

    it('should return error if page is not a number', async () => {
      mockEvent.queryStringParameters.page = 'text'
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('page')
    })

    it('should return 1st page', async () => {
      mockEvent.queryStringParameters.page = 1
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(mockModels.Contact.findAll.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findAll.mock.calls[0][0].offset).toBe(0)
      expect(mockModels.Contact.findAll.mock.calls[0][0].limit).toBe(5)
      expect(actualResult.statusCode).toBe(200)
    })

    it('should return 2nd page', async () => {
      mockEvent.queryStringParameters.page = 2
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(mockModels.Contact.findAll.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findAll.mock.calls[0][0].offset).toBe(5)
      expect(mockModels.Contact.findAll.mock.calls[0][0].limit).toBe(5)
      expect(actualResult.statusCode).toBe(200)
    })

    it('should return 3rd page', async () => {
      mockEvent.queryStringParameters.page = '3'
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(mockModels.Contact.findAll.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findAll.mock.calls[0][0].offset).toBe(10)
      expect(mockModels.Contact.findAll.mock.calls[0][0].limit).toBe(5)
      expect(actualResult.statusCode).toBe(200)
    })

    it('should return error if name query contains non alphanumeric character', async () => {
      mockEvent.queryStringParameters.name = 'na"me'
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('name')
    })

    it('should query by name', async () => {
      const Op = require('sequelize').Op
      mockEvent.queryStringParameters.name = 'name'
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(mockModels.Contact.findAll.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findAll.mock.calls[0][0].where).toEqual({
        [Op.and]: [{ name: { [Op.like]: '%name%' } }]
      })
      expect(actualResult.statusCode).toBe(200)
    })

    it('should return error if phone query contains non numeric character', async () => {
      mockEvent.queryStringParameters.phone = '32a'
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('phone')
    })

    it('should query by phone', async () => {
      const Op = require('sequelize').Op
      mockEvent.queryStringParameters.phone = '321'
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(mockModels.Contact.findAll.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findAll.mock.calls[0][0].where).toEqual({
        [Op.and]: [{ phone: { [Op.like]: '%321%' } }]
      })
      expect(actualResult.statusCode).toBe(200)
    })

    it('should return error if email query contains non alphanumeric character', async () => {
      mockEvent.queryStringParameters.email = 'ema"il'
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('email')
    })

    it('should query by email', async () => {
      const Op = require('sequelize').Op
      mockEvent.queryStringParameters.email = 'email'
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(mockModels.Contact.findAll.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findAll.mock.calls[0][0].where).toEqual({
        [Op.and]: [{ email: { [Op.like]: '%email%' } }]
      })
      expect(actualResult.statusCode).toBe(200)
    })

    it('should use and operator', async () => {
      const Op = require('sequelize').Op
      mockEvent.queryStringParameters.operator = 'and'
      mockEvent.queryStringParameters.name = 'name'
      mockEvent.queryStringParameters.phone = '321'
      mockEvent.queryStringParameters.email = 'email'
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(mockModels.Contact.findAll.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findAll.mock.calls[0][0].where).toEqual({
        [Op.and]: [
          { name: { [Op.like]: '%name%' } },
          { phone: { [Op.like]: '%321%' } },
          { email: { [Op.like]: '%email%' } }
        ]
      })
      expect(actualResult.statusCode).toBe(200)
    })

    it('should use or operator', async () => {
      const Op = require('sequelize').Op
      mockEvent.queryStringParameters.operator = 'or'
      mockEvent.queryStringParameters.name = 'name'
      mockEvent.queryStringParameters.phone = '321'
      mockEvent.queryStringParameters.email = 'email'
      const actualResult = await require('../../controllers/contacts').listContacts(mockEvent)
      expect(mockModels.Contact.findAll.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findAll.mock.calls[0][0].where).toEqual({
        [Op.or]: [
          { name: { [Op.like]: '%name%' } },
          { phone: { [Op.like]: '%321%' } },
          { email: { [Op.like]: '%email%' } }
        ]
      })
      expect(actualResult.statusCode).toBe(200)
    })
  })

  describe('get contact', () => {
    const contactData = {
      id: 5,
      name: 'Hollie Graham',
      company: 'Turner, Fox and Jones',
      address: 'Studio 54 Rogers Mills West Abigailton CH64 3TH',
      phone: '+44(0)2467 427810',
      email: 'hollie_graham@gmail.com',
      notes: 'Real estate agent, Flat 84 King Plains',
      createdAt: 'createdAt'
    }
    const mockEvent = { pathParameters: {} }

    beforeEach(() => {
      jest.spyOn(mockModels.Contact, 'findByPk').mockImplementation((id) => {
        if (id === 5) {
          return contactData
        }
        return null
      })
      mockEvent.pathParameters = {}
    })

    it('should return error if id is undefined', async () => {
      const actualResult = await require('../../controllers/contacts').getContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('id')
    })

    it('should return error if id is not valid', async () => {
      mockEvent.pathParameters.id = 'text'
      const actualResult = await require('../../controllers/contacts').getContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('id')
    })

    it('should return error if id not found', async () => {
      mockEvent.pathParameters.id = 8
      const actualResult = await require('../../controllers/contacts').getContact(mockEvent)
      expect(mockModels.Contact.findByPk.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findByPk.mock.calls[0][0]).toBe(mockEvent.pathParameters.id)
      expect(actualResult.statusCode).toBe(404)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Contact not found!')
    })

    it('should return contact', async () => {
      mockEvent.pathParameters.id = 5
      const actualResult = await require('../../controllers/contacts').getContact(mockEvent)
      expect(mockModels.Contact.findByPk.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findByPk.mock.calls[0][0]).toBe(mockEvent.pathParameters.id)
      expect(actualResult.statusCode).toBe(200)
      expect(JSON.parse(actualResult.body)).toEqual(contactData)
    })
  })

  describe('add contact', () => {
    const contactData = {
      name: 'Hollie Graham',
      company: 'Turner, Fox and Jones',
      address: 'Studio 54 Rogers Mills West Abigailton CH64 3TH',
      phone: '+44(0)2467 427810',
      email: 'hollie_graham@gmail.com',
      notes: 'Real estate agent, Flat 84 King Plains'
    }
    const mockEvent = { body: {} }

    beforeEach(() => {
      jest.spyOn(mockModels.Contact, 'create').mockImplementation(() => ({ ...contactData, createdAt: 'createdAt' }))
      mockEvent.body = {}
    })

    it('should return error if body is undefined', async () => {
      delete mockEvent.body
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('No data!')
    })

    it('should return error if body is empty', async () => {
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('name')
    })

    it('should return error if name is not given', async () => {
      mockEvent.body = { ...contactData }
      delete mockEvent.body.name
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('name')
    })

    it('should return error if name is not valid', async () => {
      mockEvent.body = { ...contactData }
      mockEvent.body.name = 'te"xt'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('name')
    })

    it('should return error if company is not valid', async () => {
      mockEvent.body = { ...contactData }
      mockEvent.body.company = 'te"xt'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('company')
    })

    it('should return error if address is not valid', async () => {
      mockEvent.body = { ...contactData }
      mockEvent.body.address = 'te"xt'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('address')
    })

    it('should return error if phone is not given', async () => {
      mockEvent.body = { ...contactData }
      delete mockEvent.body.phone
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('phone')
    })

    it('should return error if phone is not valid', async () => {
      mockEvent.body = { ...contactData }
      mockEvent.body.phone = 'text'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('phone')
    })

    it('should return error if email is not valid', async () => {
      mockEvent.body = { ...contactData }
      mockEvent.body.email = 'text'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('email')
    })

    it('should return error if notes is not valid', async () => {
      mockEvent.body = { ...contactData }
      mockEvent.body.notes = 'te"xt'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('notes')
    })

    it('should create contact when only name and phone given', async () => {
      mockEvent.body = JSON.stringify({
        name: contactData.name,
        phone: contactData.phone
      })
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(mockModels.Contact.create.mock.calls.length).toBe(1)
      expect(mockModels.Contact.create.mock.calls[0][0]).toEqual(JSON.parse(mockEvent.body))
      expect(actualResult.statusCode).toBe(201)
      expect(JSON.parse(actualResult.body)).toHaveProperty('name')
      expect(JSON.parse(actualResult.body)).toHaveProperty('phone')
      expect(JSON.parse(actualResult.body)).toHaveProperty('createdAt')
    })

    it('should create contact', async () => {
      mockEvent.body = JSON.stringify({ ...contactData })
      const actualResult = await require('../../controllers/contacts').addContact(mockEvent)
      expect(mockModels.Contact.create.mock.calls.length).toBe(1)
      expect(mockModels.Contact.create.mock.calls[0][0]).toEqual(JSON.parse(mockEvent.body))
      expect(actualResult.statusCode).toBe(201)
      expect(JSON.parse(actualResult.body)).toEqual({
        ...JSON.parse(mockEvent.body),
        createdAt: 'createdAt'
      })
    })
  })

  describe('edit contact', () => {
    const initialContactData = {
      id: 5,
      name: 'Hollie Graham',
      company: 'Turner, Fox and Jones',
      address: 'Studio 54 Rogers Mills West Abigailton CH64 3TH',
      phone: '+44(0)2467 427810',
      email: 'hollie_graham@gmail.com',
      notes: 'Real estate agent, Flat 84 King Plains',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      update: () => {}
    }
    const updatedContactData = {
      id: 5,
      name: 'name',
      company: 'Turner, Fox and Jones',
      address: 'Studio 54 Rogers Mills West Abigailton CH64 3TH',
      phone: '+44(0)2467 427810',
      email: 'hollie_graham@gmail.com',
      notes: 'Real estate agent, Flat 84 King Plains',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
    const mockEvent = { pathParameters: {}, body: {} }

    beforeEach(() => {
      jest.spyOn(mockModels.Contact, 'findByPk').mockImplementation((id) => {
        if (id === 5) {
          return initialContactData
        }
        return null
      })
      jest.spyOn(initialContactData, 'update').mockImplementation(() => updatedContactData)
      mockEvent.pathParameters = {}
      mockEvent.body = {}
    })

    it('should return error if body is undefined', async () => {
      delete mockEvent.body
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('No data!')
    })

    it('should return error if body is empty', async () => {
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('at least 1 key')
    })

    it('should return error if name is not valid', async () => {
      mockEvent.body.name = 'te"xt'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('name')
    })

    it('should return error if company is not valid', async () => {
      mockEvent.body.company = 'te"xt'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('company')
    })

    it('should return error if address is not valid', async () => {
      mockEvent.body.address = 'te"xt'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('address')
    })

    it('should return error if phone is not valid', async () => {
      mockEvent.body.phone = 'text'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('phone')
    })

    it('should return error if email is not valid', async () => {
      mockEvent.body.email = 'text'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('email')
    })

    it('should return error if notes is not valid', async () => {
      mockEvent.body.notes = 'te"xt'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('notes')
    })

    it('should return error if id is undefined', async () => {
      mockEvent.body.name = 'name'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('id')
    })

    it('should return error if id is not valid', async () => {
      mockEvent.pathParameters.id = 'text'
      mockEvent.body.name = 'name'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('id')
    })

    it('should return error if id not found', async () => {
      mockEvent.pathParameters.id = 8
      mockEvent.body.name = 'name'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(mockModels.Contact.findByPk.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findByPk.mock.calls[0][0]).toBe(mockEvent.pathParameters.id)
      expect(actualResult.statusCode).toBe(404)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Contact not found!')
    })

    it('should update contact', async () => {
      mockEvent.pathParameters.id = 5
      mockEvent.body.name = 'name'
      mockEvent.body = JSON.stringify(mockEvent.body)
      const actualResult = await require('../../controllers/contacts').editContact(mockEvent)
      expect(mockModels.Contact.findByPk.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findByPk.mock.calls[0][0]).toBe(mockEvent.pathParameters.id)
      expect(initialContactData.update.mock.calls.length).toBe(1)
      expect(initialContactData.update.mock.calls[0][0]).toEqual({ name: 'name' })
      expect(actualResult.statusCode).toBe(200)
      expect(JSON.parse(actualResult.body)).toEqual(updatedContactData)
    })
  })

  describe('delete contact', () => {
    const contactData = {
      id: 5,
      destroy: () => {}
    }
    const mockEvent = { pathParameters: {} }

    beforeEach(() => {
      jest.spyOn(mockModels.Contact, 'findByPk').mockImplementation((id) => {
        if (id === 5) {
          return contactData
        }
        return null
      })
      jest.spyOn(contactData, 'destroy')
      mockEvent.pathParameters = {}
    })

    it('should return error if id is undefined', async () => {
      const actualResult = await require('../../controllers/contacts').deleteContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('id')
    })

    it('should return error if id is not valid', async () => {
      mockEvent.pathParameters.id = 'text'
      const actualResult = await require('../../controllers/contacts').deleteContact(mockEvent)
      expect(actualResult.statusCode).toBe(400)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Validation error!')
      expect(JSON.parse(actualResult.body).details).toContain('id')
    })

    it('should return error if id not found', async () => {
      mockEvent.pathParameters.id = 8
      const actualResult = await require('../../controllers/contacts').deleteContact(mockEvent)
      expect(mockModels.Contact.findByPk.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findByPk.mock.calls[0][0]).toBe(mockEvent.pathParameters.id)
      expect(actualResult.statusCode).toBe(404)
      expect(JSON.parse(actualResult.body).error).toBe(true)
      expect(JSON.parse(actualResult.body).message).toBe('Contact not found!')
    })

    it('should return success message', async () => {
      mockEvent.pathParameters.id = 5
      const actualResult = await require('../../controllers/contacts').deleteContact(mockEvent)
      expect(mockModels.Contact.findByPk.mock.calls.length).toBe(1)
      expect(mockModels.Contact.findByPk.mock.calls[0][0]).toBe(mockEvent.pathParameters.id)
      expect(contactData.destroy.mock.calls.length).toBe(1)
      expect(actualResult.statusCode).toBe(200)
      expect(JSON.parse(actualResult.body).message).toBe('Contact deleted successfully!')
    })
  })
})
