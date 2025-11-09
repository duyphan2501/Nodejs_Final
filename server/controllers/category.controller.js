import createHttpError from "http-errors";
import {
  getCategorydByName,
  getChildByObjectID,
  deleteManyCategoryByID,
  editNameCategoryByID,
  addOneCategory,
  getListOfCategories,
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

const editCategory = async (req, res, next) => {
  try {
    const _id = req.params.id;
    if (!_id) throw createHttpError.BadRequest("_Id không tồn tại");

    const { newName } = req.body;
    if (!newName) throw createHttpError.BadRequest("Không tồn tại tên mới");

    const result = await editNameCategoryByID(_id, newName);

    if (result.modifiedCount === 0) {
      throw new Error("Edit Failed!!");
    }

    return res.status(200).json({
      success: true,
      message: `Đã sửa thành công ${result.modifiedCount} danh mục`,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục đã tồn tại trong nhóm này!",
      });
    }
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const { name, type } = req.body;

    const file = req.file;

    if (!name || !type || !file) {
      throw createHttpError.BadRequest("Thiếu trường dữ liệu");
    }

    let category = {};
    switch (type) {
      case "shoe":
        category = await getCategorydByName("Giày");
        break;
      case "sandal":
        category = await getCategorydByName("Dép");
        break;
      case "backpack":
        category = await getCategorydByName("Balo");
        break;
      default:
        throw createHttpError.BadRequest("Loại danh mục không hợp lệ");
    }

    const result = await addOneCategory(name, file.path, category._id);

    return res.status(200).json({
      success: true,
      message: `Đã thêm thành công ${result.name}`,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục đã tồn tại trong nhóm này!",
      });
    }
    next(error);
  }
};

const getListCategories = async (req, res, next) => {
  try {
    const categories = (await getListOfCategories()) || [];
    res.status(200).json({
      categories,
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
  editCategory,
  addCategory,
  getListCategories,
};
