const Joi = require('@hapi/joi');
const BaseValidator = require('./base-validator');
const JoiSchemaHelper = require('./helpers/joi-schema-helper');

class ReviewValidator extends BaseValidator {
  static getCreateSchema() {
    return Joi.object({
      rating: JoiSchemaHelper.getJoiNumberRange(1, 5),
      comment: JoiSchemaHelper.getJoiStringRequired(),
      bookId: JoiSchemaHelper.getJoiObjectIdRequired()
    });
  }

  static getUpdateSchema() {
    return Joi.object({
      rating: JoiSchemaHelper.getJoiNumberRange(1, 5),
      comment: JoiSchemaHelper.getJoiStringRequired()
    });
  }

  static getIdSchema() {
    return Joi.object({
      id: JoiSchemaHelper.getJoiObjectIdRequired()
    });
  }

  validate(data) {
    let schema;
    switch (this.type) {
      case 'create':
        schema = ReviewValidator.getCreateSchema();
        break;
      case 'update':
        schema = ReviewValidator.getUpdateSchema();
        break;
      case 'id':
        schema = ReviewValidator.getIdSchema();
        break;
      default:
        break;
    }
    return super.validate(data, schema);
  }
}

module.exports = ReviewValidator; 