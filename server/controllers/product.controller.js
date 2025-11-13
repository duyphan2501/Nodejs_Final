import createHttpError from "http-errors";
import {
  addOneProduct,
  deleteManyProduct,
  fetchProducts,
  getAllBrandNames,
  getAllProductDashboard,
  getAllProductWithVariantStock,
  getProductBySlug,
  getProductQuantity,
  getTopNBestSellingProducts,
  getLimitProductsByCategorySlug,
  getTopNNewProducts,
  getProductsByTerm,
} from "../services/product.service.js";
import { addManyVariant } from "../services/variant.service.js";
import ProductModel from "../models/product.model.js";
import VariantModel from "../models/variant.model.js";
import { getOrdersSummary } from "../services/order.service.js";
import { getCategoryBySlug } from "../services/category.service.js";
import mongoose from "mongoose";

const getProductDashboardData = async (req, res, next) => {
  try {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    if (!startDate || !endDate) {
      throw createHttpError.BadRequest("Không xác định được thời gian!");
    }

    const resProduct = await getAllProductDashboard();

    const resOrder = await getOrdersSummary(startDate, endDate);

    return res.status(200).json({
      success: true,
      productData: resProduct,
      orderData: resOrder,
    });
  } catch (error) {
    next(error);
  }
};

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

    const resultVariant = await addManyVariant(variants);

    const variantsObjId = resultVariant.map((v) => v._id);

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
    const limit = req.query.limit;
    const slug = req.query.slug;

    if (limit && slug) {
      const result = await getLimitProductsByCategorySlug(limit, slug);

      return res.status(200).json({
        success: true,
        products: result,
      });
    } else {
      const result = await getAllProductWithVariantStock();
      return res.status(200).json({
        success: true,
        message: "Lấy dữ liệu thành công",
        products: result,
      });
    }
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
    throw error;
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params._id;

    const { _id, name, brand, inputPrice, description, categoryId, variants } =
      req.validatedBody;

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm.",
      });
    }

    product.name = name;
    product.brand = brand;
    product.inputPrice = inputPrice;
    product.description = description;
    product.categoryId = categoryId;

    let variantIds = [];

    for (const [index, variant] of variants.entries()) {
      let variantDoc;

      if (variant?._id) {
        //Variant cũ sửa lại
        variantDoc = await VariantModel.findById(variant._id);

        variantDoc.color = variant.color;
        variantDoc.price = variant.price;
        variantDoc.discount = variant.discount;

        variantDoc.attributes = variant.sizes;

        const files = req.files
          .filter((f) => f.fieldname.startsWith(`variant_image_${index}_`))
          .map((f) => f.path);

        const oldUrls = req.validatedBody[`variant_oldUrls_${index}`] || [];

        const newImages = [...files, ...oldUrls];

        variantDoc.images = newImages;

        await variantDoc.save();
      } else {
        //  Thêm variant mới
        const newImages = req.files
          .filter((f) => f.fieldname.startsWith(`variant_image_${index}_`))
          .map((f) => f.path);

        variantDoc = new VariantModel({
          color: variant.color,
          price: variant.price,
          discount: variant.discount || 0,
          attributes: variant.sizes.map((s) => ({
            size: s.size,
            inStock: s.inStock,
          })),
          images: newImages,
        });

        await variantDoc.save();
      }

      variantIds.push(variantDoc._id);
    }

    product.variants = variantIds;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công!",
    });
  } catch (error) {
    next(error);
  }
};

const getProductStats = async (req, res, next) => {
  try {
    const result = await getProductQuantity();

    if (!result) {
      return createHttpError.NotFound("Không tìm thấy thông tin sản phẩm");
    }

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const fetchProductsController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOption = req.query.sort || "createdAt_desc";
    const term = req.query.term || "";
    const searchTerm = term.split("+");

    let categoryIds = Array.isArray(req.query.categoryId)
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
      filterParams,
      searchTerm
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

const getProductFeature = async (req, res, next) => {
  try {
    const limitNewest = parseInt(req.query.limitNewest) || 6;
    const limitBest = parseInt(req.query.limitBest) || 6;
    const type = req.query.type || "";

    const topSellingProducts = await getTopNBestSellingProducts(
      limitBest,
      type
    );
    const topNewProducts = await getTopNNewProducts(limitNewest, type);

    return res.status(200).json({
      success: true,
      message: "Lấy dữ liệu thành công",
      topSellingProducts,
      topNewProducts,
    });
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const term = req.query.term || "";
    const searchTerm = term.split("+");
    const result = await getProductsByTerm(searchTerm);
    return res.status(200).json({
      success: true,
      products: result,
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
  updateProduct,
  fetchProductsController,
  getAllBrands,
  getProductStats,
  getProductDashboardData,
  getProductFeature,
  searchProducts,
};
