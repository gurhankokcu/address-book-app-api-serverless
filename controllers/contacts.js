'use strict'

const config = require('config')
const Joi = require('joi')
const Op = require('sequelize').Op
const { Contact } = require('../models')

const listSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  operator: Joi.string().valid('and', 'or').default('and'),
  name: Joi.string().pattern(/^[a-zA-Z0-9 ]{1,50}$/),
  phone: Joi.string().pattern(/^[0-9()+ ]{1,20}$/),
  email: Joi.string().pattern(/^[a-zA-Z0-9@.+_-]{1,200}$/)
})

const getSchema = Joi.object({
  id: Joi.number().required()
})

const createSchema = Joi.object({
  name: Joi.string().pattern(/^[a-zA-Z0-9 ]{1,50}$/).required(),
  company: Joi.string().pattern(/^[a-zA-Z0-9\-, ]{1,100}$/),
  address: Joi.string().pattern(/^[a-zA-Z0-9\-, ]{1,200}$/),
  phone: Joi.string().pattern(/^[0-9()+ ]{1,20}$/).required(),
  email: Joi.string().email().max(200),
  notes: Joi.string().pattern(/^[a-zA-Z0-9\-, ]{1,500}$/)
})

const editSchema = Joi.object({
  name: Joi.string().pattern(/^[a-zA-Z0-9 ]{1,50}$/),
  company: Joi.string().pattern(/^[a-zA-Z0-9\-, ]{1,100}$/),
  address: Joi.string().pattern(/^[a-zA-Z0-9\-, ]{1,200}$/),
  phone: Joi.string().pattern(/^[0-9()+ ]{1,20}$/),
  email: Joi.string().email().max(200),
  notes: Joi.string().pattern(/^[a-zA-Z0-9\-, ]{1,500}$/)
}).min(1)

function createJsonResult (statusCode, body) {
  return {
    statusCode,
    body: JSON.stringify(body, null, 2)
  }
}

async function listContacts (event) {
  const { value, error } = listSchema.validate(event.queryStringParameters || {})
  if (error) {
    return createJsonResult(400, {
      error: true,
      message: 'Validation error!',
      details: error.message
    })
  }

  const pagesize = config.get('pagesize')

  const where = []
  if (value.name) {
    where.push({ name: { [Op.like]: `%${value.name}%` } })
  }
  if (value.phone) {
    where.push({ phone: { [Op.like]: `%${value.phone}%` } })
  }
  if (value.email) {
    where.push({ email: { [Op.like]: `%${value.email}%` } })
  }

  const contacts = await Contact.findAll({
    where: { [Op[value.operator]]: where },
    offset: (value.page - 1) * pagesize,
    limit: pagesize
  })
  return createJsonResult(200, contacts)
}

async function validateIdAndGetContact (event) {
  const { value, error } = getSchema.validate(event.pathParameters)
  if (error) {
    return createJsonResult(400, {
      error: true,
      message: 'Validation error!',
      details: error.message
    })
  }
  const contact = await Contact.findByPk(value.id)
  if (!contact) {
    return createJsonResult(404, {
      error: true,
      message: 'Contact not found!'
    })
  }
  return contact
}

async function getContact (event) {
  const contact = await validateIdAndGetContact(event)
  if (contact.statusCode) {
    return contact
  }
  return createJsonResult(200, contact)
}

async function addContact (event) {
  if (!event.body) {
    return createJsonResult(400, {
      error: true,
      message: 'No data!'
    })
  }
  const { value, error } = createSchema.validate(JSON.parse(event.body))
  if (error) {
    return createJsonResult(400, {
      error: true,
      message: 'Validation error!',
      details: error.message
    })
  }
  const contact = await Contact.create(value)
  return createJsonResult(201, contact)
}

async function editContact (event) {
  if (!event.body) {
    return createJsonResult(400, {
      error: true,
      message: 'No data!'
    })
  }
  const { value, error } = editSchema.validate(JSON.parse(event.body))
  if (error) {
    return createJsonResult(400, {
      error: true,
      message: 'Validation error!',
      details: error.message
    })
  }
  const contact = await validateIdAndGetContact(event)
  if (contact.statusCode) {
    return contact
  }
  const updatedContact = await contact.update(value)
  return createJsonResult(200, updatedContact)
}

async function deleteContact (event) {
  const contact = await validateIdAndGetContact(event)
  if (contact.statusCode) {
    return contact
  }
  await contact.destroy()
  return createJsonResult(200, {
    message: 'Contact deleted successfully!'
  })
}

module.exports = {
  listContacts,
  getContact,
  addContact,
  editContact,
  deleteContact
}
