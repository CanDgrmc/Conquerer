const { ValidationError } = require("../common/errors");

module.exports.validate = (schema) => (req, res, next) => {
  if (!schema) return;
  const errors = [];
  if (schema.body) {
    for(let key of Object.keys(schema.body)) {
      const {type, required} = schema.body[key];
      if (required && !req.body[key]) {
        errors.push(`${key} is required`);
      }
      if (req.body[key] && typeof req.body[key] !== type) {
        if (type === 'enum' && schema.body[key].options.includes(req.body[key])) {
          // ok
        } else {
          errors.push(`${key} is not a ${type}`);
        }
      }
    }
  }

  if (schema.params) {
    for(let key of Object.keys(schema.params)) {
      const {type, required} = schema.params[key];
      if (required && !req.params[key]) {
        errors.push(`${key} is required`);
      }

      if (req.params[key] && typeof req.params[key] !== type) {
        if (type === 'enum' && schema.params[key].options.includes(req.params[key])) {
          // ok
        } else {
          errors.push(`${key} is not a ${type}`);
        }
      }
    }
  }
  if (errors.length < 1) {
    next()
  } else {
    res.status(500).json(new ValidationError(errors).toJson());
  }
}