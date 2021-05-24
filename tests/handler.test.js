'use strict'

const { expect, it } = require('@jest/globals')
const handler = require('../handler')

describe('handler', () => {
  it('should return response', async () => {
    const mockEvent = { key: 'value' }
    const actualResult = await handler.main(mockEvent)
    expect(actualResult).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: 'It works!',
        input: mockEvent
      }, null, 2)
    })
  })
})
