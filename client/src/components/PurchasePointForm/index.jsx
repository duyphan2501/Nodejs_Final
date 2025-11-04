import { useState } from "react";
import { formatMoney } from "../../utils/formatMoney";

const PurchasePointForm = ({ user, point, setPoint, maxPoint }) => {
  const [usePoint, setUsePoint] = useState(false);
  const [status, setStatus] = useState(null);

  const userPoint = user?.purchasePoint || 0;
  const priceOfPoint = 1000;

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
      <label className="flex items-center gap-2 mb-2 text-sm cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={usePoint}
          onChange={(e) => setUsePoint(e.target.checked)}
          className="w-4 h-4"
        />
        <span>SỬ DỤNG ĐIỂM THƯỞNG</span>
      </label>

      {usePoint && (
        <div className="space-y-2 mb-2">
          <h4>
            Số điểm hiện có: <span>{userPoint}</span>{" "}
            {userPoint > 0 && (
              <span>
                (Tương đương {" "}
                <span className="money">
                  {formatMoney(userPoint * priceOfPoint)}
                </span>
                )
              </span>
            )}
          </h4>
          <input
            type="text"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            placeholder={`Số điểm muốn áp dụng (Tối đa ${maxPoint} điểm)`}
            className="border px-3 py-2 w-full rounded"
          />
          <div className="">
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 w-1/2"
            >
              Áp dụng
            </button>
            
          </div>

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

export default PurchasePointForm;
