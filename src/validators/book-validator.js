const Joi = require('@hapi/joi');
const BaseValidator = require('./base-validator');
const JoiSchemaHelper = require('./helpers/joi-schema-helper');

class BookValidator extends BaseValidator {
  static getCreateSchema() {
    return Joi.object({
      title: JoiSchemaHelper.getJoiStringRequired(),
      author: JoiSchemaHelper.getJoiStringRequired(),
      genre: JoiSchemaHelper.getJoiStringRequired(),
      description: JoiSchemaHelper.getJoiStringRequired(),
      publishedYear: JoiSchemaHelper.getJoiNumberOptional(),
      isbn: JoiSchemaHelper.getJoiStringOptional()
    });
  }

  static getListSchema() {
    return Joi.object({
      page: Joi.number().integer().min(1).optional().default(1),
      limit: Joi.number().integer().min(1).max(100).optional().default(10),
      author: JoiSchemaHelper.getJoiStringOptional(),
      genre: JoiSchemaHelper.getJoiStringOptional()
    });
  }

  static getSearchSchema() {
    return Joi.object({
      q: JoiSchemaHelper.getJoiStringRequired()
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
        schema = BookValidator.getCreateSchema();
        break;
      case 'list':
        schema = BookValidator.getListSchema();
        break;
      case 'search':
        schema = BookValidator.getSearchSchema();
        break;
      case 'id':
        schema = BookValidator.getIdSchema();
        break;
      default:
        break;
    }
    return super.validate(data, schema);
  }
}

module.exports = BookValidator; 