import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    building: "",
    city: "",
    district: "",
    ward: "",
    postalCode: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [locationData, setLocationData] = useState({
    cities: [],
    districts: [],
    wards: [],
  });

  // Load dữ liệu địa phương từ API
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((res) => res.json())
      .then((data) => {
        setLocationData({
          cities: data,
          districts: [],
          wards: [],
        });
      })
      .catch((err) => console.error("Error loading location data:", err));
  }, []);

  // Lấy danh sách quận/huyện khi chọn tỉnh/thành
  useEffect(() => {
    if (formData.city) {
      const selectedCity = locationData.cities.find(
        (c) => c.name === formData.city
      );
      if (selectedCity) {
        setLocationData((prev) => ({
          ...prev,
          districts: selectedCity.districts || [],
          wards: [],
        }));
      }
    }
  }, [formData.city, locationData.cities]);

  // Lấy danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (formData.district) {
      const selectedDistrict = locationData.districts.find(
        (d) => d.name === formData.district
      );
      if (selectedDistrict) {
        setLocationData((prev) => ({
          ...prev,
          wards: selectedDistrict.wards || [],
        }));
      }
    }
  }, [formData.district, locationData.districts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset district và ward khi đổi city
      ...(name === "city" ? { district: "", ward: "" } : {}),
      // Reset ward khi đổi district
      ...(name === "district" ? { ward: "" } : {}),
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "Vui lòng điền tên của bạn";
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng điền họ";
    if (!formData.streetAddress.trim())
      newErrors.streetAddress = "Vui lòng điền địa chỉ";
    if (!formData.city) newErrors.city = "Vui lòng chọn thành phố";
    if (!formData.district) newErrors.district = "Vui lòng chọn quận";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng điền số điện thoại";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setAddresses((prev) => [...prev, { ...formData, id: Date.now() }]);
      setFormData({
        firstName: "",
        lastName: "",
        streetAddress: "",
        building: "",
        city: "",
        district: "",
        ward: "",
        postalCode: "",
        phone: "",
      });
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setFormData({
      firstName: "",
      lastName: "",
      streetAddress: "",
      building: "",
      city: "",
      district: "",
      ward: "",
      postalCode: "",
      phone: "",
    });
    setErrors({});
  };

  const removeAddress = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">SỔ ĐỊA CHỈ</h1>
          <p className="text-sm text-gray-600">
            Bạn còn{" "}
            <span className="font-semibold">{5 - addresses.length}/5</span> địa
            chỉ..
          </p>
        </div>

        {/* Add Address Button */}
        <div className="border border-gray-300 rounded p-6 mb-4 hover:border-gray-400 transition-colors">
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-start justify-between text-left"
          >
            <span className="text-base">Thêm Địa Chỉ</span>
            <Plus className="w-6 h-6 flex-shrink-0" strokeWidth={1.5} />
          </button>
        </div>

        {/* Address List */}
        {addresses.length > 0 && (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="border border-gray-300 rounded p-6 relative"
              >
                <button
                  onClick={() => removeAddress(addr.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="pr-8">
                  <h3 className="font-semibold text-base mb-2">
                    {addr.firstName} {addr.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {addr.streetAddress}
                  </p>
                  {addr.building && (
                    <p className="text-sm text-gray-600 mb-1">
                      {addr.building}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mb-1">
                    {addr.ward && `${addr.ward}, `}
                    {addr.district}, {addr.city}
                  </p>
                  {addr.postalCode && (
                    <p className="text-sm text-gray-600 mb-1">
                      Mã bưu chính: {addr.postalCode}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">Việt Nam</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Số điện thoại: {addr.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex items-start md:items-center justify-center p-0 md:p-4 overflow-y-auto">
            <div className="bg-white w-full md:max-w-3xl min-h-screen md:min-h-0 md:max-h-[100vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl md:text-2xl font-bold">
                  THÊM ĐỊA CHỈ MỚI
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Tên *"
                      className={`w-full px-4 py-3 border ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      } rounded focus:outline-none focus:border-black`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Họ *"
                      className={`w-full px-4 py-3 border ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      } rounded focus:outline-none focus:border-black`}
                    />
                  </div>
                </div>

                {/* Street Address */}
                <div className="mb-4">
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    placeholder="Số nhà/Tên đường *"
                    className={`w-full px-4 py-3 border ${
                      errors.streetAddress
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded focus:outline-none focus:border-black`}
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Ví dụ: 33 Lê Duẩn,...
                  </p>
                </div>

                {/* Building */}
                <div className="mb-4">
                  <input
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                    placeholder="Tên tòa nhà/Số tầng..."
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Ví dụ: Tòa nhà Đức; Tòa X1 - Chung cư XYZ,...
                  </p>
                </div>

                {/* City and District */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      } rounded focus:outline-none focus:border-black bg-white`}
                    >
                      <option value="">Thành phố/Tỉnh *</option>
                      {locationData.cities.map((city) => (
                        <option key={city.code} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      disabled={!formData.city}
                      className={`w-full px-4 py-3 border ${
                        errors.district ? "border-red-500" : "border-gray-300"
                      } rounded focus:outline-none focus:border-black bg-white ${
                        !formData.city ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <option value="">Quận *</option>
                      {locationData.districts.map((district) => (
                        <option key={district.code} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ward and Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <select
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      disabled={!formData.district}
                      className={`w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black bg-white ${
                        !formData.district
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <option value="">Phường/Xã</option>
                      {locationData.wards.map((ward) => (
                        <option key={ward.code} value={ward.name}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-gray-500 text-sm mt-1">
                      Ví dụ: Phường Bến Nghé; Xã Bà Điểm,...
                    </p>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Mã bưu chính *"
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    />
                    <p className="text-gray-500 text-sm mt-1">Ví dụ: 700000</p>
                  </div>
                </div>

                {/* Country */}
                <div className="mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Quốc gia:</span> Việt Nam
                  </p>
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Số Điện Thoại *"
                    className={`w-full px-4 py-3 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded focus:outline-none focus:border-black`}
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Ví dụ: 0912345678
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col-reverse md:flex-row gap-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-black text-white py-3 px-8 rounded hover:bg-gray-800 transition-colors font-semibold uppercase"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-white text-black py-3 px-8 rounded border-2 border-black hover:bg-gray-50 transition-colors font-semibold uppercase"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBook;
