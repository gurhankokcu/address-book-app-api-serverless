'use strict'

const controller = require('../../controllers/main')

describe('main controller', () => {
  it('should return message', () => {
    const actualResult = controller.getMain()
    expect(actualResult.statusCode).toBe(200)
    expect(actualResult.body).toBe('It works!')
  })
})
