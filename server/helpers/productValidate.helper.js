import Joi from "joi";

export const productSchema = Joi.object({
  // 🏷️ Tên sản phẩm
  name: Joi.string().required().messages({
    "string.base": "Tên sản phẩm phải là chuỗi ký tự",
    "string.empty": "Vui lòng nhập tên sản phẩm",
    "any.required": "Tên sản phẩm là bắt buộc",
  }),

  // 💰 Giá nhập
  inputPrice: Joi.number().min(0).required().messages({
    "number.base": "Giá nhập phải là số",
    "number.min": "Giá nhập phải lớn hơn hoặc bằng 0",
    "any.required": "Giá nhập là bắt buộc",
  }),

  // 🧩 Danh mục
  categories: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.base": "Danh mục phải là một danh sách",
    "array.min": "Vui lòng chọn ít nhất một danh mục",
    "any.required": "Danh mục là bắt buộc",
  }),

  // 📝 Mô tả
  description: Joi.string().allow("").optional().messages({
    "string.base": "Mô tả phải là chuỗi ký tự",
  }),

  // 🧬 Biến thể sản phẩm
  variants: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required().messages({
          "number.base": "ID biến thể phải là số",
          "any.required": "Thiếu ID của biến thể",
        }),

        name: Joi.string().required().messages({
          "string.base": "Tên biến thể phải là chuỗi ký tự",
          "string.empty": "Vui lòng nhập tên biến thể",
          "any.required": "Tên biến thể là bắt buộc",
        }),

        label: Joi.string().required().messages({
          "string.base": "Nhãn biến thể phải là chuỗi ký tự",
          "string.empty": "Vui lòng nhập nhãn biến thể",
          "any.required": "Nhãn biến thể là bắt buộc",
        }),

        sellPrice: Joi.number().required().messages({
          "number.base": "Giá bán phải là số",
          "any.required": "Giá bán là bắt buộc",
        }),

        basePrice: Joi.number().required().messages({
          "number.base": "Giá gốc phải là số",
          "any.required": "Giá gốc là bắt buộc",
        }),

        // 🧦 Kiểm tra tồn kho
        inStock: Joi.object()
          .pattern(
            Joi.string(),
            Joi.alternatives().try(Joi.number().min(0), Joi.string())
          )
          .custom((value, helpers) => {
            const hasPositive = Object.values(value).some((v) => Number(v) > 0);
            if (!hasPositive) {
              return helpers.message(
                "Phải có ít nhất một size có số lượng lớn hơn 0"
              );
            }
            return value;
          })
          .messages({
            "object.base": "Dữ liệu tồn kho không hợp lệ",
          }),

        // 🖼️ Ảnh sản phẩm
        images: Joi.array()
          .length(5) // 👉 Phải có đúng 6 phần tử
          .items(
            Joi.object({
              file: Joi.any().required(), // Có thể bỏ required nếu bạn muốn file trống vẫn hợp lệ
              preview: Joi.string().allow(null, ""),
            })
          )
          .required()
          .messages({
            "array.base": "Danh sách ảnh không hợp lệ",
            "array.length": "Mỗi biến thể phải có đúng 6 ảnh",
            "any.required": "Thiếu ảnh của biến thể",
            "object.base":
              "Mỗi ảnh phải là một đối tượng hợp lệ (không được bỏ trống)",
          }),

        save: Joi.boolean().valid(true).required(),
        discount: Joi.number().required().min(0).max(100),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Danh sách biến thể không hợp lệ",
      "array.min": "Sản phẩm phải có ít nhất một biến thể",
      "any.required": "Thiếu thông tin biến thể sản phẩm",
    }),
});
