import { X } from "lucide-react";
import { useEffect, useState } from "react";

const GuestAddress = ({ address = null, setAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardsList, setWardsList] = useState([]);

  const [formData, setFormData] = useState(
    address || {
      receiver: "",
      phone: "",
      province: "",
      ward: "",
      addressDetail: "",
    }
  );

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.receiver.trim())
      newErrors.receiver = "Vui lòng điền tên người nhận";
    if (!formData.addressDetail.trim())
      newErrors.addressDetail = "Vui lòng điền địa chỉ cụ thể";
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành phố";
    if (!formData.ward) newErrors.ward = "Vui lòng chọn phường/xã";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng điền số điện thoại";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadWards = (provinceName, allProvinces, allWards) => {
    const selectedProvince = allProvinces.find(
      (item) => item.name === provinceName
    );
    if (!selectedProvince) return;

    const perspectiveWards = allWards.filter(
      (item) => item.province_code === selectedProvince.code
    );
    setWards(perspectiveWards);
  };

  const handleSaveAddress = () => {
    if (validateForm()) {
      setAddress(formData);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, wRes] = await Promise.all([
          fetch("./provinces.json"),
          fetch("./wards.json"),
        ]);
        const provincesData = await pRes.json();
        const wardsData = await wRes.json();

        setProvinces(provincesData);
        setWardsList(wardsData);

        if (address?.province) {
          loadWards(formData.province, provincesData, wardsData);
        }
      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
      }
    };
    loadData();
  }, []);

  const handleProvinceChange = (e) => {
    const selectedProvinceName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      province: selectedProvinceName,
      ward: "",
    }));
    loadWards(selectedProvinceName, provinces, wardsList);
  };

  const handleAddressChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="md:p-6 p-4 bg-white shadow-md rounded-2xl border border-gray-200">
      {/* Name + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="mb-2 font-semibold">Tên người nhận</p>
          <input
            type="text"
            value={formData.receiver}
            onChange={handleAddressChange("receiver")}
            placeholder="Tên người nhận *"
            className={`w-full px-4 py-3 border ${
              errors.receiver ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:[#002B5B] transition`}
          />
          {errors.receiver && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" /> {errors.receiver}
            </p>
          )}
        </div>
        <div>
          <p className="mb-2 font-semibold">SĐT người nhận</p>
          <input
            type="tel"
            value={formData.phone}
            onChange={handleAddressChange("phone")}
            placeholder="Số điện thoại *"
            className={`w-full px-4 py-3 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:[#002B5B] transition`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" /> {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Address detail */}
      <div className="mb-4">
        <p className="mb-2 font-semibold">Địa chỉ cụ thể</p>
        <input
          type="text"
          value={formData.addressDetail}
          onChange={handleAddressChange("addressDetail")}
          placeholder="Số nhà, tên đường *"
          className={`w-full px-4 py-3 border ${
            errors.addressDetail ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:[#002B5B] transition`}
        />
        {errors.addressDetail && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <X className="w-4 h-4" /> {errors.addressDetail}
          </p>
        )}
      </div>

      {/* Province + Ward */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="mb-2 font-semibold">Tỉnh/thành phố</p>
          <select
            value={formData.province}
            onChange={handleProvinceChange}
            className={`w-full px-4 py-3 border ${
              errors.province ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:[#002B5B] bg-white transition`}
          >
            <option value="">Chọn Tỉnh/Thành phố *</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" /> {errors.province}
            </p>
          )}
        </div>

        <div>
          <p className="mb-2 font-semibold">Phường/xã</p>
          <select
            value={formData.ward}
            onChange={handleAddressChange("ward")}
            disabled={!formData.province}
            className={`w-full px-4 py-3 border ${
              errors.ward ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:[#002B5B] bg-white transition ${
              !formData.province ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Chọn Phường/Xã *</option>
            {wards.map((w) => (
              <option key={w.code} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
          {errors.ward && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" /> {errors.ward}
            </p>
          )}
        </div>
      </div>

      {/* Continue button */}
      <button
        onClick={handleSaveAddress}
        className="w-full bg-[#002B5B] text-white py-3 rounded-lg font-medium cursor-pointer hover:bg-[#003d7a] transition duration-200"
      >
        Lưu và đến bước thanh toán
      </button>
    </div>
  );
};

export default GuestAddress;
