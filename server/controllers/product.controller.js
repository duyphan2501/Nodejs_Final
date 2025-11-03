import createHttpError from "http-errors";
import { addOneProduct } from "../services/product.service.js";
import { addManyVariant } from "../services/variant.service.js";

const addProduct = async (req, res, next) => {
  try {
    let { name, categories, inputPrice, description, variants } =
      req.validatedBody;

    if (!name || !categories || !inputPrice || !description || !variants) {
      throw createHttpError.BadRequest("Vui lòng nhập đầy đủ thông tin");
    }

    if (categories === "string") {
      categories = JSON.parse(categories);
    }

    if (typeof variants === "string") {
      variants = JSON.parse(variants);
    }

    //Gắn file path hình vào từng variant
    variants = variants.map((variant, i) => {
      const images = req.files
        .filter((f) => f.fieldname.startsWith(`variant_images_${i}_`))
        .map((f) => f.path);
      return { ...variant, images };
    });

    //Thêm sản phẩm vào trước
    const formatProduct = {
      name,
      categoryId: categories,
      inputPrice,
      description,
    };
    const resultProduct = await addOneProduct(formatProduct);

    //Thêm variant vào db
    const resultVariant = await addManyVariant(
      variants,
      resultProduct.insertedId
    );

    res.status(200).json({
      success: true,
      message: "Thêm sản phẩm thành công",
    });
  } catch (error) {
    next(error);
  }
};

export { addProduct };
