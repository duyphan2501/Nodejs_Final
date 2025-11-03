import React, { useState } from "react";

const PromoCode = () => {
  const [usePromoCode, setUsePromoCode] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null);

  const handleApply = async () => {
    try {
      const res = await fetch("https://dummyjson.com/carts/1");
      const data = await res.json();

      if (code === "SALE50") {
        setStatus({ success: true, message: "Mã hợp lệ, giảm 50%!" });
      } else {
        setStatus({ success: false, message: "Mã không hợp lệ!" });
      }
    } catch (error) {
      setStatus({ success: false, message: "Có lỗi xảy ra khi gọi API" });
    }
  };

  return (
    <div>
      <label className="flex items-center gap-2 mb-4 text-sm cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={usePromoCode}
          onChange={(e) => setUsePromoCode(e.target.checked)}
          className="w-4 h-4"
        />
        <span>SỬ DỤNG MÃ KHUYẾN MÃI</span>
      </label>

      {usePromoCode && (
        <div className="space-y-2 mb-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Nhập mã khuyến mãi"
            className="border px-3 py-2 w-full rounded"
          />
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 " 
          >
            Áp dụng
          </button>

          {status && (
            <p
              className={`text-sm ${
                status.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PromoCode;
