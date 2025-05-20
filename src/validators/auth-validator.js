const Joi = require('@hapi/joi');
const BaseValidator = require('./base-validator');
const JoiSchemaHelper = require('./helpers/joi-schema-helper');

class AuthValidator extends BaseValidator {
  static getSignupSchema() {
    return Joi.object({
      username: JoiSchemaHelper.getJoiStringRequired(3),
      email: JoiSchemaHelper.getJoiEmailRequired(),
      password: JoiSchemaHelper.getJoiPasswordRequired()
    });
  }

  static getLoginSchema() {
    return Joi.object({
      email: JoiSchemaHelper.getJoiEmailRequired(),
      password: JoiSchemaHelper.getJoiPasswordRequired()
    });
  }

  validate(data) {
    let schema;
    switch (this.type) {
      case 'signup':
        schema = AuthValidator.getSignupSchema();
        break;
      case 'login':
        schema = AuthValidator.getLoginSchema();
        break;
      default:
        break;
    }
    return super.validate(data, schema);
  }
}

module.exports = AuthValidator; 