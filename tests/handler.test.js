'use strict'

describe('handler', () => {
  const mockEvent = { key: 'value1' }
  const mockResult = { key: 'value2' }

  describe('main', () => {
    it('should call controller get main', async () => {
      const controller = require('../controllers/main')
      jest.spyOn(controller, 'getMain').mockImplementation(() => mockResult)
      const actualResult = await require('../handler').getMain(mockEvent)
      expect(controller.getMain).toHaveBeenCalledWith(mockEvent)
      expect(actualResult).toEqual(mockResult)
    })
  })

  describe('contacts', () => {
    it('should call controller list contacts', async () => {
      const controller = require('../controllers/contacts')
      jest.spyOn(controller, 'listContacts').mockImplementation(() => mockResult)
      const actualResult = await require('../handler').listContacts(mockEvent)
      expect(controller.listContacts).toHaveBeenCalledWith(mockEvent)
      expect(actualResult).toEqual(mockResult)
    })

    it('should call controller get contact', async () => {
      const controller = require('../controllers/contacts')
      jest.spyOn(controller, 'getContact').mockImplementation(() => mockResult)
      const actualResult = await require('../handler').getContact(mockEvent)
      expect(controller.getContact).toHaveBeenCalledWith(mockEvent)
      expect(actualResult).toEqual(mockResult)
    })

    it('should call controller add contact', async () => {
      const controller = require('../controllers/contacts')
      jest.spyOn(controller, 'addContact').mockImplementation(() => mockResult)
      const actualResult = await require('../handler').addContact(mockEvent)
      expect(controller.addContact).toHaveBeenCalledWith(mockEvent)
      expect(actualResult).toEqual(mockResult)
    })

    it('should call controller edit contact', async () => {
      const controller = require('../controllers/contacts')
      jest.spyOn(controller, 'editContact').mockImplementation(() => mockResult)
      const actualResult = await require('../handler').editContact(mockEvent)
      expect(controller.editContact).toHaveBeenCalledWith(mockEvent)
      expect(actualResult).toEqual(mockResult)
    })

    it('should call controller delete contact', async () => {
      const controller = require('../controllers/contacts')
      jest.spyOn(controller, 'deleteContact').mockImplementation(() => mockResult)
      const actualResult = await require('../handler').deleteContact(mockEvent)
      expect(controller.deleteContact).toHaveBeenCalledWith(mockEvent)
      expect(actualResult).toEqual(mockResult)
    })
  })
})
