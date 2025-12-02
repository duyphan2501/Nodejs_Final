import createHttpError from "http-errors";
import VariantModel from "../models/variant.model.js";
import mongoose from "mongoose";

const addManyVariant = async (variants) => {
  try {
    const result = await VariantModel.insertMany(variants, {
      ordered: true,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const getAvailableStockDB = async (variantId, size) => {
  const variant = await VariantModel.findOne({
    _id: variantId,
  }).lean();

  if (!variant) {
    throw createHttpError.NotFound(
      `Sản phẩm variantId ${variantId} không tìm thấy.`
    );
  }

  const attribute = variant.attributes.find((attr) => attr.size === size);

  if (!attribute) {
    throw createHttpError.NotFound(
      `Kích thước ${size} không tồn tại cho variantId ${variantId}.`
    );
  }

  return attribute.inStock;
};

const addStockAtomic = async (item, session) => {
  let { variantId, size, quantity, name } = item;
  variantId = new mongoose.Types.ObjectId(`${variantId}`);

  const updateResult = await VariantModel.findOneAndUpdate(
    {
      _id: variantId,
      "attributes.size": size,
    },
    {
      $inc: { "attributes.$.inStock": quantity }, // Giảm số lượng
    },
    {
      new: true,
      session,
    }
  );

  if (!updateResult) {
    throw new Error(`Variant ${variantId} with size ${size} not found`);
  }

  return updateResult;
};

const deductStockAtomic = async (item, session) => {
  let { variantId, size, quantity } = item;
  const name = `${item.name} - ${item.color}`;
  variantId = new mongoose.Types.ObjectId(`${variantId}`);

  const updateResult = await VariantModel.findOneAndUpdate(
    {
      _id: variantId,
      attributes: {
        $elemMatch: {
          size: size,
          inStock: { $gte: quantity },
        },
      },
    },
    {
      $inc: { "attributes.$.inStock": -quantity },
    },
    {
      new: true,
      session,
      runValidators: true,
    }
  );

  if (!updateResult) {
    const actualVariant = await VariantModel.findOne(
      {
        _id: variantId,
        "attributes.size": size,
      },
      null,
      { session }
    ).lean();

    if (!actualVariant) {
      throw createHttpError(404, `Sản phẩm ${name}-${size} không tồn tại.`);
    }

    const attribute = actualVariant.attributes.find((a) => a.size === size);
    if (attribute && attribute.inStock === 0) {
      throw createHttpError(400, `Sản phẩm ${name}, size ${size} đã hết hàng.`);
    }

    if (attribute && attribute.inStock < quantity) {
      throw createHttpError(
        400,
        `Không đủ hàng cho ${name}, size ${size}. Chỉ còn: ${attribute.inStock}`
      );
    }

    throw createHttpError(400, `Failed to update stock for item ${name}.`);
  }
};

export {
  addManyVariant,
  deductStockAtomic,
  getAvailableStockDB,
  addStockAtomic,
};
