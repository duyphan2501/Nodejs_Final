import createHttpError from "http-errors";
import {
  addOneProduct,
  deleteManyProduct,
  fetchProducts,
  getAllBrandNames,
  getAllProductWithVariantStock,
  getProductBySlug,
} from "../services/product.service.js";
import { addManyVariant } from "../services/variant.service.js";

const addProduct = async (req, res, next) => {
  try {
    let { name, categoryId, brand, inputPrice, description, variants } =
      req.validatedBody;

    //Gắn file path hình vào từng variant
    variants = variants.map((variant, i) => {
      const images = req.files
        .filter((f) => f.fieldname.startsWith(`variant_images_${i}_`))
        .map((f) => f.path);
      return { ...variant, images };
    });

    //Thêm variant vào db
    const resultVariant = await addManyVariant(variants);

    //Tách mảng ObjectId của variant đã add
    const variantsObjId = resultVariant.map((v) => v._id);

    //Thêm sản phẩm vao db
    const formatProduct = {
      name,
      categoryId,
      brand,
      inputPrice,
      description,
      variants: variantsObjId,
    };
    const resultProduct = await addOneProduct(formatProduct);

    res.status(200).json({
      success: true,
      message: "Thêm sản phẩm thành công",
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const result = await getAllProductWithVariantStock();
    return res.status(200).json({
      success: true,
      message: "Lấy dữ liệu thành công",
      products: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProductBySlugController = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await getProductBySlug(slug);

    return res.status(200).json({
      success: true,
      message: "Lấy dữ liệu thành công",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const listId = req.body._ids;

    if (!listId) {
      return createHttpError.BadRequest("_Id không tồn tại");
    }

    const result = await deleteManyProduct(listId);

    return res.status(200).json({
      success: true,
      message: `Đã xóa thành công ${result.deletedCount} sản phẩm!`,
    });
  } catch (error) {
    nexy(error);
  }
};

const fetchProductsController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOption = req.query.sort || "createdAt_desc";

    const categoryIds = Array.isArray(req.query.categoryId)
      ? req.query.categoryId
      : req.query.categoryId
      ? [req.query.categoryId]
      : [];

    const brands = Array.isArray(req.query.brand)
      ? req.query.brand
      : req.query.brand
      ? [req.query.brand]
      : [];

    const filterParams = {
      categoryId: categoryIds,
      brand: brands,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
    };
   
    const { totalPages, products } = await fetchProducts(
      page,
      limit,
      sortOption,
      filterParams
    );

    return res.status(200).json({
      success: true,
      message: "Lấy dữ liệu thành công",
      totalPages,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBrands = async (req, res, next) => {
  try {
    const brands = await getAllBrandNames();
    return res.status(200).json({
      brands,
    });
  } catch (error) {
    next(error);
  }
};

export {
  addProduct,
  getProduct,
  deleteProduct,
  getProductBySlugController,
  fetchProductsController,
  getAllBrands,
};
