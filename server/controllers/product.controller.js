import createHttpError from "http-errors";
import {
  addOneProduct,
  deleteManyProduct,
  getAllProductWithVariantStock,
  getProductBySlug,
} from "../services/product.service.js";
import { addManyVariant } from "../services/variant.service.js";
import ProductModel from "../models/product.model.js";
import VariantModel from "../models/variant.model.js";

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

export {
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  getProductBySlugController,
};
