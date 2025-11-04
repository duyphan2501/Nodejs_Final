import VariantModel from "../models/variant.model.js";

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

export { addManyVariant };
