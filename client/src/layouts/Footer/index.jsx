import React from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";


export const footerData = {
  columns: [
    {
      title: "SẢN PHẨM",
      items: [
        { label: "Giày", link: "/giay" },
        { label: "Quần áo", link: "/quan-ao" },
        { label: "Phụ kiện", link: "/phu-kien" },
        { label: "Hàng Mới Về", link: "/hang-moi-ve" },
        { label: "Release Dates", link: "/release-dates" },
        { label: "Top Sellers", link: "/top-sellers" },
        { label: "Member exclusives", link: "/member-exclusives" },
        { label: "Outlet", link: "/outlet" },
      ],
    },
    {
      title: "THỂ THAO",
      items: [
        { label: "Chạy", link: "/chay" },
        { label: "Đánh gôn", link: "/golf" },
        { label: "Gym & Training", link: "/gym-training" },
        { label: "Bóng đá", link: "/bong-da" },
        { label: "Bóng Rổ", link: "/bong-ro" },
        { label: "Quần vợt", link: "/quan-vot" },
        { label: "Ngoài trời", link: "/ngoai-troi" },
        { label: "Bơi lội", link: "/boi-loi" },
        { label: "Motorsport", link: "/motorsport" },
      ],
    },
    {
      title: "BỘ SƯU TẬP",
      items: [
        { label: "Pharrell Williams", link: "/pharrell" },
        { label: "Ultra Boost", link: "/ultra-boost" },
        { label: "Pureboost", link: "/pureboost" },
        { label: "Predator", link: "/predator" },
        { label: "Superstar", link: "/superstar" },
        { label: "Stan Smith", link: "/stan-smith" },
        { label: "NMD", link: "/nmd" },
        { label: "Adicolor", link: "/adicolor" },
      ],
    },
    {
      title: "THÔNG TIN VỀ CÔNG TY",
      items: [
        { label: "Giới Thiệu Về Chúng Tôi", link: "/gioi-thieu" },
        { label: "Cơ Hội Nghề Nghiệp", link: "/nghe-nghiep" },
        { label: "Tin tức", link: "/tin-tuc" },
        { label: "adidas stories", link: "/stories" },
      ],
    },
    {
      title: "HỖ TRỢ",
      items: [
        { label: "Trợ Giúp", link: "/tro-giup" },
        { label: "Công cụ tìm kiếm cửa hàng", link: "/tim-kiem" },
        { label: "Biểu Đồ Kích Cỡ", link: "/kich-co" },
        { label: "Thanh toán", link: "/thanh-toan" },
        { label: "Giao hàng", link: "/giao-hang" },
        { label: "Trả Hàng & Hoàn Tiền", link: "/tra-hang" },
        { label: "khuyến mãi", link: "/khuyen-mai" },
        { label: "Trợ Giúp Dịch Vụ Khách Hàng", link: "/dich-vu" },
      ],
    },
    {
      title: "THEO DÕI CHÚNG TÔI",
      items: [
        { label: "Facebook", link: "https://facebook.com", icon: "facebook" },
        {
          label: "Instagram",
          link: "https://instagram.com",
          icon: "instagram",
        },
        { label: "Twitter", link: "https://twitter.com", icon: "twitter" },
        {
          label: "Pinterest",
          link: "https://pinterest.com",
          icon: "pinterest",
        },
        { label: "TikTok", link: "https://tiktok.com", icon: "tiktok" },
        { label: "YouTube", link: "https://youtube.com", icon: "youtube" },
      ],
    },
  ],
  bottomLinks: [
    { label: "Cài Đặt Cookie", link: "/cookie" },
    { label: "Chính sách Bảo mật", link: "/privacy" },
    { label: "Điều Khoản và Điều Kiện", link: "/terms" },
    { label: "XUẤT BẢN ĐỒI", link: "/xuat-ban" },
  ],
  copyright: "© 2020 Công ty TNHH adidas Việt Nam",
  badge: "https://tse1.mm.bing.net/th/id/OIP.JWsl39NXvjcGkxk3H3aB8wHaCz?rs=1&pid=ImgDetMain&o=7&rm=3",
};



const SocialIcon = ({ type, link }) => {
  const icons = {
    facebook: <Facebook size={20} />,
    instagram: <Instagram size={20} />,
    twitter: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    pinterest: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    ),
    tiktok: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    youtube: <Youtube size={20} />,
  };

  return (
    <a
      href={link}
      className="inline-block hover:opacity-70 transition-opacity duration-200"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={type}
    >
      {icons[type]}
    </a>
  );
};

const Footer = ({
  columns = footerData.columns,
  bottomLinks = footerData.bottomLinks,
  copyright = footerData.copyright,
  badge = footerData.badge,
}) => {
  return (
    <footer className="bg-dark border-t-2 border-white text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 mb-12">
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">
                {column.title}
              </h3>
              <div className="flex flex-col gap-3">
                {column.items.map((item, i) =>
                  item.icon ? (
                    <SocialIcon key={i} type={item.icon} link={item.link} />
                  ) : (
                    <a
                      key={i}
                      href={item.link}
                      className="text-sm hover:opacity-70 transition-opacity duration-200"
                    >
                      {item.label}
                    </a>
                  )
                )}
                {column.title === "THEO DÕI CHÚNG TÔI" && badge && (
                  <div className="mt-4">
                    <img src={badge} alt="Badge" className="w-36 h-auto" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6 text-xs">
            {bottomLinks.map((link, index) => (
              <a
                key={index}
                href={link.link}
                className="hover:opacity-70 transition-opacity duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="text-xs text-gray-500">{copyright}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
