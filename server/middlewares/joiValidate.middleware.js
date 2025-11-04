import Joi from "joi";

export default function validate(schema) {
  return (req, res, next) => {
    try {
      const data = { ...req.body };

      for (const key in data) {
        if (typeof data[key] === "string") {
          try {
            const parsed = JSON.parse(data[key]);
            data[key] = parsed;
          } catch (_) {}
        }
      }

      // Validate
      const { error, value } = schema.validate(data, { abortEarly: false });

      if (error) {
        const messages = error.details.map((d) => d.message);
        return res.status(400).json({
          success: false,
          message: messages[0],
          details: messages,
        });
      }

      req.validatedBody = value;
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Validation middleware error",
      });
    }
  };
}
