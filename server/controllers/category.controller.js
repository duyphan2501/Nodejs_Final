import createHttpError from "http-errors";
import CategoryModel from "../models/category.model.js";
import {
  getCategorydByName,
  getChildByObjectID,
  deleteManyCategoryByID,
} from "../services/category.service.js";

const getShoeCategory = async (req, res, next) => {
  try {
    const category = await getCategorydByName("Giày");
    const categoriesChild = await getChildByObjectID(category._id);

    return res.status(200).json({
      success: true,
      categories: categoriesChild,
    });
  } catch (error) {
    next(error);
  }
};

const getSandalCategory = async (req, res, next) => {
  try {
    const category = await getCategorydByName("Dép");
    const categoriesChild = await getChildByObjectID(category._id);

    return res.status(200).json({
      success: true,
      categories: categoriesChild,
    });
  } catch (error) {
    next(error);
  }
};

const getBackpackCategory = async (req, res, next) => {
  try {
    const category = await getCategorydByName("Balo");
    const categoriesChild = await getChildByObjectID(category._id);

    return res.status(200).json({
      success: true,
      categories: categoriesChild,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { listId } = req.body;

    if (!listId) {
      return createHttpError.BadRequest("_Id không tồn tại");
    }

    const result = await deleteManyCategoryByID(listId);

    return res.status(200).json({
      success: true,
      message: `Đã xóa thành công ${result.deletedCount} danh mục!`,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getShoeCategory,
  getSandalCategory,
  getBackpackCategory,
  deleteCategory,
};
