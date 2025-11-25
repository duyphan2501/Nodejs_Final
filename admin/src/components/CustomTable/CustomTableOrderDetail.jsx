import { useEffect, useMemo } from "react";
import useOrderStore from "../../../stores/useOrderStore";

export default function CustomTableOrderDetail() {
  const orderDetailList = useOrderStore((s) => s.orderDetailList);
  const orderDetail = useOrderStore((s) => s.orderDetail);

  const columns = [
    { id: "detail", label: "Chi Tiết", minWidth: 160 },
    { id: "price", label: "Giá", minWidth: 100 },
    { id: "quantity", label: "Số Lượng", minWidth: 100 },
    { id: "subtotal", label: "Tổng Đơn", minWidth: 100 },
  ];

  const rows = orderDetailList.map((item) =>
    createData(
      item.name,
      item.size,
      item.color,
      item.image,
      item.price,
      item.quantity
    )
  );

  return (
    <>
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="">
            {columns.map((col) => (
              <th
                key={col.id}
                className="p-2 text-left border-b border-gray-300"
                style={{ minWidth: col.minWidth }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-300 hover:bg-gray-50">
              <td className="p-2 flex items-center gap-3">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/${row.detail.img}`}
                  alt={row.detail.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div>
                  <p className="font-semibold text-blue-700">
                    {row.detail.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Size: {row.detail.size} | Màu: {row.detail.color}
                  </p>
                </div>
              </td>
              <td className="p-2">{row.price.toLocaleString()}₫</td>
              <td className="p-2">{row.quantity}</td>
              <td className="p-2">{row.subtotal.toLocaleString()}₫</td>
            </tr>
          ))}
          <tr>
            <td className="p-2 text-xl font-bold" colSpan={3}>
              Tổng Cộng
            </td>
            <td className="p-2 text-xl font-bold">
              {rows
                .reduce((acc, cur) => acc + cur.subtotal, 0)
                .toLocaleString()}
              đ
            </td>
          </tr>
          <tr>
            <td className="p-2 text-lg text-gray-500" colSpan={3}>
              Phí ship
            </td>
            <td className="p-2 text-lg font-semibold">- 0đ</td>
          </tr>
          <tr>
            <td className="p-2 text-lg text-gray-500" colSpan={3}>
              Discount gốc:
            </td>
            <td className="p-2 text-lg font-semibold">
              - {orderDetail?.itemsDiscounted?.toLocaleString() || 0}đ
            </td>
          </tr>
          <tr>
            <td className="p-2 text-lg text-gray-500" colSpan={3}>
              Coupon: {orderDetail?.coupon?.code}
            </td>
            <td className="p-2 text-lg font-semibold">
              - {orderDetail?.coupon?.amountReduced.toLocaleString() || 0}đ
            </td>
          </tr>
          <tr>
            <td className="p-2 text-lg text-gray-500" colSpan={3}>
              Điểm thưởng: {orderDetail?.usedPoint?.point}
            </td>
            <td className="p-2 text-lg font-semibold">
              - {orderDetail?.usedPoint?.amountReduced.toLocaleString() || 0}đ
            </td>
          </tr>
          <tr>
            <td className="p-2 text-xl font-bold" colSpan={3}>
              Thành Tiền
            </td>
            <td className="p-2 text-xl font-bold">
              {orderDetail?.orderAmount?.toLocaleString()}đ
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function createData(name, size, color, img, price, quantity) {
  const subtotal = price * quantity;
  return {
    detail: { name, size, color, img },
    price,
    quantity,
    subtotal,
  };
}
