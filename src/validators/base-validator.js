class BaseValidator {
  constructor(type) {
    this.type = type;
    this.errors = [];
  }

  validate(data, schema) {
    if (!schema) return true;

    const { error, value } = schema.validate(data, { abortEarly: false });
    
    if (error) {
      this.errors = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return false;
    }

    this.value = value;
    return true;
  }
}

module.exports = BaseValidator; 