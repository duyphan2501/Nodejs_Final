import useCategoryStore from "../../store/useCategoryStore";
import { useEffect } from "react";

function transformCategories(data) {
  return data.map((parent) => ({
    _id: parent._id,
    name: parent.name,
    children: (parent.children || []).map((child) => ({
      _id: child._id,
      name: child.name,
      slug: child.slug,
    })),
  }));
}

const Footer = () => {
  const categories = useCategoryStore((s) => s.categories);
  const getListCategories = useCategoryStore((s) => s.getListCategories);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    await getListCategories();
  };
  return (
    <footer className="border-t-2 border-white bg-dark text-white px-6 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {transformCategories(categories).map((cat) => (
          <div key={cat._id}>
            <p className="font-bold mb-3 uppercase subtitle">{cat.name}</p>
            <ul className="space-y-2">
              {cat.children.map((child) => (
                <li key={child._id}>
                  <a
                    href={`/products/${child.slug}`}
                    className="hover:text-gray-300 cursor-pointer transition-colors duration-200"
                  >
                    {child.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="font-bold mb-3 uppercase subtitle">Hỗ trợ khách hàng</p>
          <ul className="space-y-2">
            <li className="hover:text-gray-300 cursor-pointer">
              Chính sách đổi trả
            </li>
            <li className="hover:text-gray-300 cursor-pointer">
              Giao hàng & thanh toán
            </li>
            <li className="hover:text-gray-300 cursor-pointer">Bảo hành</li>
            <li className="hover:text-gray-300 cursor-pointer">
              Liên hệ hỗ trợ
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <p>© 2025 ShoeStore. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">
            Facebook
          </a>
          <a href="#" className="hover:text-white">
            Instagram
          </a>
          <a href="#" className="hover:text-white">
            TikTok
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
