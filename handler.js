'use strict'

const mainController = require('./controllers/main')
const contactsController = require('./controllers/contacts')

async function getMain (event) {
  return await mainController.getMain(event)
}

async function listContacts (event) {
  return await contactsController.listContacts(event)
}

async function getContact (event) {
  return await contactsController.getContact(event)
}

async function addContact (event) {
  return await contactsController.addContact(event)
}

async function editContact (event) {
  return await contactsController.editContact(event)
}

async function deleteContact (event) {
  return await contactsController.deleteContact(event)
}

module.exports = {
  getMain,
  listContacts,
  getContact,
  addContact,
  editContact,
  deleteContact
}
