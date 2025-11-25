const orderConfirmationEmail = (
  orderId,
  items = [],
  orderAmount,
  address,
  provider
) => {
  const itemsHTML = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0;">${item.name} - ${item.color} (x${item.quantity})</td>
          <td style="padding: 8px 0; text-align: right;">${item.price.toLocaleString()}đ</td>
        </tr>
      `
    )
    .join("");

  return {
    subject: `Xác nhận đơn hàng #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 650px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background-color: #4CAF50; color: #ffffff; text-align: center; padding: 16px; font-size: 20px; font-weight: bold;">
            Xác nhận đơn hàng thành công ✔️
          </div>

          <!-- Body -->
          <div style="padding: 25px;">
            <p>Xin chào,</p>

            <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi! 🎉</p>

            <p>Mã đơn hàng của bạn là:</p>
            <div style="text-align: center; margin: 20px 0;">
              <div style="display: inline-block; background: #4CAF50; color: #ffffff; font-size: 22px; font-weight: bold; padding: 10px 30px; border-radius: 8px;">
                ${orderId}
              </div>
            </div>

            <h3 style="margin-top: 25px;">📦 Thông tin sản phẩm</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              ${itemsHTML}
              <tr style="border-top: 1px solid #ddd;">
                <td style="padding: 10px 0; font-weight: bold;">Tổng cộng:</td>
                <td style="padding: 10px 0; text-align: right; font-weight: bold;">${orderAmount.toLocaleString()}đ</td>
              </tr>
            </table>

            <h3 style="margin-top: 25px;">🚚 Địa chỉ giao hàng</h3>
            <p>
              <strong>${address.receiver}</strong><br/>
              SĐT: ${address.phone}<br/>
              ${address.addressDetail}, ${address.ward}, ${address.province}
            </p>

            <h3 style="margin-top: 25px;">💳 Phương thức thanh toán</h3>
            <p><strong>${provider.toUpperCase()}</strong></p>

            <p style="margin-top: 25px;">Chúng tôi sẽ thông báo khi đơn hàng được giao cho đơn vị vận chuyển.</p>

            <p style="margin-top: 20px;">Trân trọng,<br/><strong>Đội ngũ hỗ trợ</strong></p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f0f0; text-align: center; padding: 12px; font-size: 12px; color: #666;">
            &copy; ${new Date().getFullYear()} Our Shop. All rights reserved.
          </div>

        </div>
      </div>
    `,
  };
};

export default orderConfirmationEmail;
