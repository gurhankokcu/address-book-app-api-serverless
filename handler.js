'use strict'

async function main (event) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'It works!',
        input: event
      },
      null,
      2
    )
  }
}

module.exports = {
  main
}
