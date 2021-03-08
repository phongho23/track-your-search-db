const logger = require('../logger')

const NO_ERRORS = null

function getWeekValidationError({ name }) {

  if (name.length === 0) {
    logger.error(`Week must have a value`)
    return {
      error: {
        message: `Week must have a value`
      }
    }
  }
  return NO_ERRORS
}

module.exports = {
  getWeekValidationError,
}

