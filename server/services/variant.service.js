import VariantModel from "../models/variant.model.js";

const addManyVariant = async (variants, productId) => {
  const variantWithID = variants.map((variant) => {
    return { ...variant, productId };
  });

  try {
    const result = await VariantModel.insertMany(variantWithID, {
      ordered: true,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

export { addManyVariant };
