const categories = [
  {
    _id: 1,
    name: "Giày nam",
    children: [
      { _id: 11, name: "Sneaker" },
      { _id: 12, name: "Sandal" },
      { _id: 13, name: "Giày Tây" },
      { _id: 14, name: "Boot" },
      { _id: 15, name: "Dép" },
    ],
  },
  {
    _id: 2,
    name: "Giày nữ",
    children: [
      { _id: 21, name: "Sneaker nữ" },
      { _id: 22, name: "Cao gót" },
      { _id: 23, name: "Búp bê" },
      { _id: 24, name: "Boot nữ" },
    ],
  },
  {
    _id: 3,
    name: "Phụ kiện",
    children: [
      { _id: 31, name: "Túi xách" },
      { _id: 32, name: "Balo" },
      { _id: 33, name: "Thắt lưng" },
      { _id: 34, name: "Vớ / Tất" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t-2 border-white bg-black text-white px-6 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {categories.map((cat) => (
          <div key={cat._id}>
            <p className="font-bold mb-3 uppercase subtitle">{cat.name}</p>
            <ul className="space-y-2 ">
              {cat.children.map((child) => (
                <li
                  key={child._id}
                  className="hover:text-gray-300 cursor-pointer transition-colors"
                >
                  {child.name}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="font-bold mb-3 uppercase subtitle">Hỗ trợ khách hàng</p>
          <ul className="space-y-2">
            <li className="hover:text-gray-300 cursor-pointer">Chính sách đổi trả</li>
            <li className="hover:text-gray-300 cursor-pointer">Giao hàng & thanh toán</li>
            <li className="hover:text-gray-300 cursor-pointer">Bảo hành</li>
            <li className="hover:text-gray-300 cursor-pointer">Liên hệ hỗ trợ</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <p>© 2025 ShoeStore. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Facebook</a>
          <a href="#" className="hover:text-white">Instagram</a>
          <a href="#" className="hover:text-white">TikTok</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
