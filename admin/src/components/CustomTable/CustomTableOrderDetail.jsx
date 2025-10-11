import React from "react";

export default function CustomTableOrderDetail() {
  const columns = [
    { id: "detail", label: "Chi Tiết", minWidth: 160 },
    { id: "price", label: "Giá", minWidth: 100 },
    { id: "quantity", label: "Số Lượng", minWidth: 100 },
    { id: "subtotal", label: "Tổng Đơn", minWidth: 100 },
  ];

  const rows = [
    createData(
      "Giày mẫu 1",
      "42",
      "Trắng",
      "https://m.media-amazon.com/images/I/61BeLM4rxXL._SL1500_.jpg",
      650000,
      1
    ),
    createData(
      "Giày mẫu 2",
      "41",
      "Đen",
      "https://m.media-amazon.com/images/I/61BeLM4rxXL._SL1500_.jpg",
      620000,
      2
    ),
    createData(
      "Giày mẫu 3",
      "40",
      "Xám",
      "https://m.media-amazon.com/images/I/61BeLM4rxXL._SL1500_.jpg",
      600000,
      1
    ),
    createData(
      "Giày mẫu 4",
      "43",
      "Trắng/Xanh",
      "https://m.media-amazon.com/images/I/61BeLM4rxXL._SL1500_.jpg",
      670000,
      1
    ),
    createData(
      "Giày mẫu 5",
      "44",
      "Đỏ",
      "https://m.media-amazon.com/images/I/61BeLM4rxXL._SL1500_.jpg",
      700000,
      3
    ),
  ];

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
                  src={row.detail.img}
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
            <td className="p-2 text-lg font-semibold">30.000đ</td>
          </tr>
          <tr>
            <td className="p-2 text-lg text-gray-500" colSpan={3}>
              Coupon: FREESHIP
            </td>
            <td className="p-2 text-lg font-semibold">-27.000đ</td>
          </tr>
          <tr>
            <td className="p-2 text-lg text-gray-500" colSpan={3}>
              Điểm thưởng
            </td>
            <td className="p-2 text-lg font-semibold">-20.000đ</td>
          </tr>
          <tr>
            <td className="p-2 text-xl font-bold" colSpan={3}>
              Thành Tiền
            </td>
            <td className="p-2 text-xl font-bold">5.183.000đ</td>
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
