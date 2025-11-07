import { useState } from "react";

const PersonalInfo = ({ user, handleSave }) => {
  const [isEditPersonal, setIsEditPersonal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  // State to manage validation errors
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    if (field === "phone") {
      // 1. Restrict input to digits only as they type
      value = value.replace(/\D/g, "");
    }

    setFormData({ ...formData, [field]: value });
    // Clear previous error when the user starts typing again
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Name validation (example: must not be empty)
    if (!formData.name.trim()) {
      formErrors.name = "Họ tên không được để trống.";
      isValid = false;
    }

    // Phone validation (example: 10 digits exactly, or adjust range as needed)
    const phoneRegex = /^\d{10}$/; // Exactly 10 digits
    if (formData.phone != "" && !phoneRegex.test(formData.phone)) {
      formErrors.phone = "Số điện thoại không hợp lệ (phải đủ 10 số).";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleSave(formData.name, formData.phone);
      setIsEditPersonal(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          THÔNG TIN CÁ NHÂN
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            {/* Họ tên */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className="block font-semibold text-gray-700 w-30 ">
                  Họ tên:
                </span>
                {isEditPersonal ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange("name")}
                    className={`border w-[400px] p-3 rounded-lg focus:outline-none transition ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-2 focus:ring-[#002B5B]"
                    }`}
                    placeholder="Nhập họ tên"
                  />
                ) : (
                  <label className="block text-base text-gray-800">
                    {formData.name || "Chưa cập nhật"}
                  </label>
                )}
              </div>
              {/* Error message for name */}
              {isEditPersonal && errors.name && (
                <p className="text-red-500 text-sm mt-1 ml-[calc(120px+8px)]">
                  {errors.name}
                </p>
              )}
            </div>

            {/* SDT */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-gray-700 w-30 ">
                  Số điện thoại:
                </span>
                {isEditPersonal ? (
                  <input
                    type="text" // Keep as text to allow smooth masking/validation
                    value={formData.phone}
                    onChange={handleChange("phone")}
                    maxLength={10} // Optional: Restrict max length
                    className={`border w-[400px] p-3 rounded-lg focus:outline-none transition ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-2 focus:ring-[#002B5B]"
                    }`}
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <label className="block text-base  text-gray-800">
                    {formData.phone || "Chưa cập nhật"}
                  </label>
                )}
              </div>
              {/* Error message for phone */}
              {isEditPersonal && errors.phone && (
                <p className="text-red-500 text-sm mt-1 ml-[calc(120px+8px)]">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Nút hành động */}
          {isEditPersonal ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                className="text-xs sm:text-sm font-medium text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
              >
                LƯU
              </button>
              <button
                onClick={() => {
                  setIsEditPersonal(false);
                  setErrors({}); // Clear errors when canceling
                }}
                className="text-xs sm:text-sm font-medium cursor-pointer text-gray-700 underline hover:no-underline transition"
              >
                HỦY
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setFormData({
                  name: user?.name || "",
                  phone: user?.phone || "",
                });
                setIsEditPersonal(true);
              }}
              className="self-start text-xs sm:text-sm font-medium text-gray-900 underline hover:no-underline transition-all whitespace-nowrap"
            >
              CHỈNH SỬA
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
