import createHttpError from "http-errors";
import { addOneProduct } from "../services/product.service.js";
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

export { addProduct };
