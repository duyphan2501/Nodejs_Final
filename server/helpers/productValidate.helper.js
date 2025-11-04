import Joi from "joi";

export const productSchema = Joi.object({
  // 🏷️ Tên sản phẩm
  name: Joi.string().required().messages({
    "string.base": "Tên sản phẩm phải là chuỗi ký tự.",
    "string.empty": "Vui lòng nhập tên sản phẩm.",
    "any.required": "Tên sản phẩm là bắt buộc.",
  }),

  // 💰 Giá nhập
  inputPrice: Joi.number().min(0).required().messages({
    "number.base": "Giá nhập phải là một số hợp lệ.",
    "number.min": "Giá nhập phải lớn hơn hoặc bằng 0.",
    "any.required": "Vui lòng nhập giá nhập của sản phẩm.",
  }),

  // 🏢 Thương hiệu
  brand: Joi.string().required().messages({
    "any.required": "Thương hiệu là bắt buộc.",
  }),

  // 🧩 Danh mục
  categoryId: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.base": "Danh mục phải là một danh sách hợp lệ.",
    "array.min": "Vui lòng chọn ít nhất một danh mục.",
    "any.required": "Danh mục là bắt buộc.",
  }),

  // 📝 Mô tả
  description: Joi.string().allow("").optional().messages({
    "string.base": "Mô tả phải là chuỗi ký tự.",
  }),

  // 🧬 Biến thể sản phẩm
  variants: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required().messages({
          "number.base": "ID biến thể phải là số.",
          "any.required": "Thiếu ID của biến thể.",
        }),

        color: Joi.string().required().messages({
          "string.base": "Tên màu phải là chuỗi ký tự.",
          "string.empty": "Vui lòng nhập tên màu cho biến thể.",
          "any.required": "Màu của biến thể là bắt buộc.",
        }),

        price: Joi.number().min(0).max(100000000).required().messages({
          "number.base": "Giá bán phải là số.",
          "number.min": "Giá bán không được nhỏ hơn 0.",
          "number.max": "Giá bán không được vượt quá 100.000.000.",
          "any.required": "Vui lòng nhập giá bán cho biến thể.",
        }),

        // 🧾 Thuộc tính (size, số lượng tồn,...)
        attributes: Joi.array()
          .items(
            Joi.object({
              size: Joi.string().required().messages({
                "string.base": "Kích cỡ phải là chuỗi ký tự.",
                "any.required": "Thiếu kích cỡ trong thuộc tính.",
              }),
              inStock: Joi.number().min(0).max(100000000).required().messages({
                "number.base": "Số lượng tồn phải là số.",
                "number.min": "Số lượng tồn không được âm.",
                "number.max": "Số lượng tồn vượt quá giới hạn cho phép.",
                "any.required": "Vui lòng nhập số lượng tồn kho.",
              }),
            })
          )
          .min(1)
          .required()
          .messages({
            "array.base": "Danh sách thuộc tính không hợp lệ.",
            "array.min": "Phải có ít nhất một thuộc tính sản phẩm.",
            "any.required": "Thiếu danh sách thuộc tính sản phẩm.",
          }),

        // 🖼️ Ảnh sản phẩm
        images: Joi.array()
          .length(5)
          .items(
            Joi.object({
              file: Joi.any().required().messages({
                "any.required": "Thiếu tệp ảnh của sản phẩm.",
              }),
              preview: Joi.string().allow(null, "").messages({
                "string.base": "Đường dẫn xem trước ảnh phải là chuỗi.",
              }),
            })
          )
          .required()
          .messages({
            "array.base": "Danh sách ảnh không hợp lệ.",
            "array.length": "Mỗi biến thể phải có đúng 5 ảnh.",
            "any.required": "Thiếu ảnh cho biến thể sản phẩm.",
            "object.base": "Mỗi ảnh phải là một đối tượng hợp lệ.",
          }),

        // ✅ Trạng thái lưu
        save: Joi.boolean().valid(true).required().messages({
          "any.only": "Giá trị 'save' phải là true.",
          "any.required": "Thiếu trạng thái lưu của biến thể.",
        }),

        // 💸 Giảm giá
        discount: Joi.number().min(0).max(100).required().messages({
          "number.base": "Giảm giá phải là số.",
          "number.min": "Giảm giá không được nhỏ hơn 0%.",
          "number.max": "Giảm giá không được lớn hơn 100%.",
          "any.required": "Vui lòng nhập mức giảm giá.",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Danh sách biến thể không hợp lệ.",
      "array.min": "Sản phẩm phải có ít nhất một biến thể.",
      "any.required": "Thiếu thông tin biến thể sản phẩm.",
    }),
});
