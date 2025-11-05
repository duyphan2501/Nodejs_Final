import { useState } from "react";
import { formatMoney } from "../../utils/formatMoney";
import { ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const PurchasePointForm = ({ user, usedPoint, setUsedPoint, maxPoint }) => {
  const [usePoint, setUsePoint] = useState(false);
  const [point, setPoint] = useState("");

  const userPoint = user?.purchasePoint || 0;
  const priceOfPoint = 1000;

  const handlePointChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "");
    setPoint(numericValue);
  };

  const handleApply = async () => {
    const pointsToUse = parseInt(point, 10);
    if (!pointsToUse || isNaN(pointsToUse) || pointsToUse <= 0) {
      toast.error("Vui lòng nhập số điểm hợp lệ lớn hơn 0.");
      return;
    }
    if (pointsToUse > userPoint) {
      toast.error(`Bạn chỉ có ${userPoint} điểm.`);
      return;
    }
    if (pointsToUse > maxPoint) {
      toast.error(
        `Bạn chỉ có thể sử dụng tối đa ${maxPoint} điểm cho đơn hàng này.`
      );
      return;
    }

    const amountReduced = pointsToUse * priceOfPoint;
    setUsedPoint({
      point: pointsToUse,
      amountReduced: amountReduced,
    });
    toast.success("Áp dụng điệm thưởng thành công");
  };

  const handleCancel = () => {
    setUsedPoint({
      point: 0,
      amountReduced: 0,
    });
    setPoint("");
    setUsePoint(false); // Đóng form
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 mb-2 text-sm cursor-pointer w-fit"
        onClick={() => setUsePoint((prev) => !prev)}
      >
        <span className={`${usePoint ? "rotate-180" : "rotate-0"}`}>
          <ChevronDown />
        </span>
        <span>SỬ DỤNG ĐIỂM THƯỞNG</span>
        {usedPoint.point > 0 && (
          <span className="money">(Giảm được {formatMoney(usedPoint.point * priceOfPoint)})</span>
        )}
      </div>

      {usePoint && (
        <div className="space-y-2 mb-2">
          <h4>
            Số điểm hiện có: <span>{userPoint}</span>{" "}
            {userPoint > 0 && (
              <span>
                (Tương đương{" "}
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
            onChange={handlePointChange} // Dùng hàm handlePointChange mới
            placeholder={`Số điểm muốn áp dụng (Tối đa ${maxPoint} điểm)`}
            className={`border px-3 py-2 w-full rounded`}
          />

          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 w-1/2 cursor-pointer"
            >
              Áp dụng
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

export default PurchasePointForm;
