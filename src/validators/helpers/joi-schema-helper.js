const Joi = require('@hapi/joi');

class JoiSchemaHelper {
  static getJoiStringRequired(min = 1, max = 255) {
    return Joi.string().trim().min(min).max(max).required();
  }

  static getJoiStringOptional(min = 1, max = 255) {
    return Joi.string().trim().min(min).max(max).optional();
  }

  static getJoiEmailRequired() {
    return Joi.string().trim().email().required();
  }

  static getJoiPasswordRequired(min = 6) {
    return Joi.string().min(min).required();
  }

  static getJoiNumberRequired() {
    return Joi.number().required();
  }

  static getJoiNumberOptional() {
    return Joi.number().optional();
  }

  static getJoiNumberRange(min, max) {
    return Joi.number().min(min).max(max).required();
  }

  static getJoiObjectIdRequired() {
    return Joi.string().regex(/^[0-9a-fA-F]{24}$/).required();
  }

  static getJoiObjectIdOptional() {
    return Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional();
  }

  static getJoiPaginationSchema() {
    return Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10)
    });
  }
}

module.exports = JoiSchemaHelper; 