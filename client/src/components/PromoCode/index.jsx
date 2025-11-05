import React, { useState } from "react";
import useCouponStore from "../../store/useCouponStore";
import BiLoader from "../BiLoader";
import { calculateDiscountedPrice } from "../../utils/calculatePrice";
import { ChevronDown } from "lucide-react";
import { formatMoney } from "../../utils/formatMoney";

const PromoCode = ({ couponForOrder, setCouponForOrder, orderAmount }) => {
  const [usePromoCode, setUsePromoCode] = useState(false);
  const [code, setCode] = useState("");
  const { isCouponLoading, applyCoupon } = useCouponStore();

  const handleApply = async () => {
    if (isCouponLoading) return;
    const coupon = await applyCoupon(code, orderAmount);
    if (coupon) {
      const amountReduced =
        coupon.discountType === "fixed"
          ? coupon.discountAmount
          : orderAmount - calculateDiscountedPrice(orderAmount, coupon.discountPercent);

      setCouponForOrder({
        code: coupon.code,
        amountReduced,
      });
    }
  };

  const handleCancel = () => {
    setCode("");
    setCouponForOrder({
      code: null,
      amountReduced: 0,
    });
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 mb-4 text-sm cursor-pointer w-fit"
        onClick={() => setUsePromoCode((prev) => !prev)}
      >
        <span className={`${usePromoCode ? "rotate-180" : "rotate-0"}`}>
          <ChevronDown />
        </span>
        <span>SỬ DỤNG MÃ KHUYẾN MÃI</span>
         {couponForOrder.amountReduced > 0 && (
          <span className="money">(Giảm được {formatMoney(couponForOrder.amountReduced)})</span>
        )}
      </div>

      {usePromoCode && (
        <div className="space-y-2 mb-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Nhập mã khuyến mãi"
            className="border px-3 py-2 w-full rounded"
          />
          <div className="flex gap-3">
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 w-1/2 cursor-pointer"
            >
              {isCouponLoading ? <BiLoader size={15} /> : "Áp dụng"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 w-1/2 cursor-pointer"
            >
              Huỷ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCode;
