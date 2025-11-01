import createHttpError from "http-errors";
import { addCartItem, loadCart } from "../services/cart.service.js";
import { v4 as uuidv4 } from "uuid";

const addToCart = async (req, res, next) => {
  try {
    const { item, quantity, userId } = req.body;
    let { cartId } = req.cookies;

    if (!item || !quantity) {
      throw createHttpError.BadRequest("Thiếu biến thể hoặc số lượng");
    }
    let cartKey;

    if (userId) {
      cartKey = `cart:${userId}`;
    } else {
      if (!cartId) {
        cartId = uuidv4();
        res.cookie("cartId", cartId, {
          httpOnly: true,
          maxAge: 4 * 24 * 60 * 60 * 1000,
        });
      }
      cartKey = `cart:${cartId}`;
    }
    // đặt chỗ
    // const { changed } = await reserveStock(userId, cartId, variantId, quantity);

    // cập nhật giỏ trong Redis
    await addCartItem(userId, cartId, item, quantity);

    // const outOfStockQty = quantity - changed;
    // if (outOfStockQty !== 0)
    //   return res.status(400).json({
    //     message: `Out of stock!${changed !== 0 ? `Quantity increases only ${changed}` : ""}`,
    //     success: false,
    //   });

    return res.status(200).json({
      message: "Đã thêm vào giỏ hàng!",
      success: true,
      cart: await loadCart(userId, cartId),
    });
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    let { userId } = req.params;
    if (userId === "guest") userId = null;
    let guestCartId = req.cookies.cartId;

    const cart =
      userId || guestCartId ? await loadCart(userId, guestCartId) : [];

    return res
      .status(200)
      .json({ cart, message: "Tải giỏ hàng thành công", success: true });
  } catch (error) {
    next(error);
  }
};

export { addToCart, getCart };
