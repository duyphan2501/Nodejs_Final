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

const editNameCategoryByID = async (_id, newName) => {
  try {
    const objectIds = new mongoose.Types.ObjectId(_id);

    const result = await CategoryModel.updateOne(
      { _id: objectIds },
      { $set: { name: newName } }
    );

    return result;
  } catch (error) {
    throw error;
  }
};

const addOneCategory = async (name, image, parentId) => {
  try {
    const parentObjectId = new mongoose.Types.ObjectId(parentId);

    const result = await CategoryModel.create({
      name,
      image,
      parentId: parentObjectId,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const getListOfCategories = async () => {
  const categories = await CategoryModel.find();
  const categoryMap = {};
  categories.forEach((cate) => {
    categoryMap[cate._id] = { ...cate._doc, children: [] };
  });
  const rootCategories = [];
  categories.forEach((cate) => {
    if (cate.parentId)
      categoryMap[cate.parentId].children.push(categoryMap[cate._id]);
    else rootCategories.push(categoryMap[cate._id]);
  });
  return rootCategories;
};


export {
  getCategorydByName,
  getChildByObjectID,
  deleteManyCategoryByID,
  editNameCategoryByID,
  addOneCategory,
  getListOfCategories
};
