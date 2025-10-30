import mongoose from "mongoose";
import CategoryModel from "../models/category.model.js";

const getCategorydByName = async (name) => {
  const category = await CategoryModel.findOne({ name });
  return category;
};

const getChildByObjectID = async (_id) => {
  const objectId = new mongoose.Types.ObjectId(_id);
  const categories = await CategoryModel.find({ parentId: objectId }).sort({
    name: 1,
  });

  return categories;
};

const deleteManyCategoryByID = async (_id) => {
  try {
    const objectIds = _id.map((id) => new mongoose.Types.ObjectId(id));

    const result = await CategoryModel.deleteMany({ _id: { $in: objectIds } });

    return result;
  } catch (error) {
    throw error;
  }
};

export { getCategorydByName, getChildByObjectID, deleteManyCategoryByID };
