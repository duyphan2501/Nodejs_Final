import { useState } from "react";
import useUserStore from "../../store/useUserStore";
import useCartStore from "../../store/useCartStore";
import CheckoutItem from "../../components/CheckoutItem";
import { formatMoney } from "../../utils/formatMoney";
import PromoCode from "../../components/PromoCode";
import PurchasePointForm from "../../components/PurchasePointForm";
import { toast } from "react-toastify";
import GuestAddress from "../../components/Address/GuestAddress";
import { MapPin } from "lucide-react";

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);
  const addresses = [];
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleCompleteOrder = () => {
    if (paymentMethod === "cod") {
      toast.success("Đơn hàng của bạn đã được đặt thành công!");
    } else if (paymentMethod === "payos") {
      toast.info("Đang chuyển đến PayOS để thanh toán...");
    }
  };

  const [address, setAddress] = useState({
    receiver: "",
    phone: "",
    province: "",
    ward: "",
    addressType: "home",
    addressDetail: "",
    isDefault: false,
  });

  const steps = [
    { id: 1, title: "Thông tin liên hệ" },
    { id: 2, title: "Thông tin giao hàng" },
    { id: 3, title: "Xác nhận và thanh toán" },
  ];

  const user = useUserStore((state) => state.user);
  const cartItems = useCartStore((state) => state.cartItems);

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const calculateTotalDiscounted = () =>
    cartItems.reduce((totalDiscount, item) => {
      const discountedPerItem = (item.price * item.discount) / 100;
      return totalDiscount + discountedPerItem * item.quantity;
    }, 0);

  const total = calculateTotal();
  const totalDiscounted = calculateTotalDiscounted();

  const [formData, setFormData] = useState({
    email: user?.email || "",
    point: user?.purchasePoint || 0,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSetAddress = (addr) => {
    if (checkValidAddress(addr)) {
      setAddress(addr);
      handleSetStep(3);
    }
  };

  const checkEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
  const checkValidAddress = (addr) => {
    return (
      addr.receiver &&
      addr.phone &&
      addr.province &&
      addr.ward &&
      addr.addressDetail
    );
  };
  const handleSetStep = (step) => {
    if (currentStep === 1)
      if (!checkEmail(formData.email)) {
        toast.error("Email không hợp lệ");
        return;
      }
    if (currentStep === 2)
      if (!checkValidAddress(address)) {
        setCompletedStep(1);
        if (step !== 1) return;
      }
    setCurrentStep(step);
    setCompletedStep((prev) => Math.max(prev, step));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row container">
      {/* Left Section */}
      <div className="w-full lg:w-2/3 p-8">
        <h1 className="text-4xl font-semibold text-[#002B5B] uppercase title mb-6">Quy trình thanh toán</h1>

        <div>
          {steps.map((step) => (
            <div key={step.id} className="mb-4 border-b pb-4">
              {/* HEADER của mỗi STEP */}
              <div
                onClick={() => handleSetStep(step.id)}
                className={`flex items-center gap-3 cursor-pointer ${
                  step.id === currentStep
                    ? "text-[#002B5B] font-semibold"
                    : step.id <= completedStep
                    ? "text-[#002B5B]"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                    step.id === currentStep
                      ? "bg-[#002B5B] text-white border-[#002B5B]"
                      : step.id <= completedStep
                      ? "bg-green-500 text-white border-green-500"
                      : "border-gray-400 text-gray-400"
                  }`}
                >
                  {step.id}
                </div>
                <h2 className="text-2xl title font-semibold">{step.title}</h2>
              </div>

              {/* STEP CONTENT */}
              {step.id === 1 && currentStep === 1 && (
                <div className="mt-4 lg:ml-9 space-y-4 ">
                  <h3>Nhập email của bạn để nhận được thông tin về đơn hàng</h3>
                  <input
                    type="email"
                    value={formData.email}
                    placeholder="Email address"
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:[#002B5B] transition"
                  />

                  <button
                    onClick={() => handleSetStep(2)}
                    className="bg-[#002B5B] text-white px-6 py-3 rounded-md w-full cursor-pointer font-medium hover:bg-[#003d7a]"
                  >
                    Tiếp tục đến địa chỉ giao hàng
                  </button>
                </div>
              )}

              {step.id === 2 && currentStep === 2 && (
                <div className="mt-6 lg:ml-9">
                  <GuestAddress
                    address={address}
                    setAddress={handleSetAddress}
                  />
                </div>
              )}

              {step.id === 3 && currentStep === 3 && (
                <div className="lg:ml-9 mt-4 ">
                  <div className="mb-6">
                    {address ? (
                      <div className="md:ml-7 text-gray-600 leading-relaxed">
                        <div className="flex gap-2">
                          <p className="font-medium">Email:</p>
                          <p>{formData.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <p className="font-medium">Người nhận:</p>
                          <p>
                            <span className="">
                              {address.receiver}
                            </span>{" "}
                            - {address.phone}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <p className="font-medium text-nowrap">Địa chỉ:</p>
                          <p>
                            {address.addressDetail}, {address.ward},{" "}
                            {address.province}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="ml-7 text-gray-500 italic">
                        Chưa nhập địa chỉ
                      </p>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#002B5B] mb-4">
                    Phương thức thanh toán
                  </h3>

                  <div className="space-y-4">
                    {/* COD Option */}
                    <label
                      className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        paymentMethod === "cod"
                          ? "border-[#002B5B] bg-[#f3f7fc]"
                          : "border-gray-300 hover:border-[#002B5B]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-[#002B5B] w-5 h-5"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          Thanh toán khi nhận hàng
                        </p>
                        <p className="text-gray-500 text-sm">
                          Bạn sẽ thanh toán trực tiếp cho nhân viên giao hàng.
                        </p>
                      </div>
                    </label>

                    {/* PayOS Option */}
                    <label
                      className={`flex items-center gap-4 border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        paymentMethod === "payos"
                          ? "border-[#002B5B] bg-[#f3f7fc]"
                          : "border-gray-300 hover:border-[#002B5B]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="payos"
                        checked={paymentMethod === "payos"}
                        onChange={() => setPaymentMethod("payos")}
                        className="accent-[#002B5B] w-5 h-5"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          Thanh toán ngay (PayOS)
                        </p>
                        <p className="text-gray-500 text-sm">
                          Thanh toán nhanh chóng qua PayOS bằng thẻ hoặc ví điện
                          tử.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleCompleteOrder}
                      className="bg-green-600 text-white px-6 py-3 rounded-md w-full font-medium hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      {paymentMethod === "payos"
                        ? "Thanh toán ngay qua PayOS"
                        : "Hoàn tất đơn hàng"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Order Summary */}
      <div className="w-full lg:w-1/3 bg-gray-50 p-8 lg:border-l">
        <h2 className="text-lg font-semibold mb-4">
          Tóm tắt đơn hàng ({cartItems.length})
        </h2>

        <div className="space-y-4 max-h-50 overflow-y-auto scroll">
          {cartItems.map((item) => (
            <CheckoutItem item={item} key={item.variantId + item.size} />
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <PurchasePointForm user={user} />
          <PromoCode />
        </div>

        <div className="mt-6 border-t pt-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Tổng cộng</span>
            <span className="money">{formatMoney(total)}</span>
          </div>
          <div className="flex justify-between text-green-700 font-medium">
            <span>Đã giảm</span>
            <span className="money">-{formatMoney(totalDiscounted)}</span>
          </div>
          <div className="flex justify-between">
            <span>Vận chuyển</span>
            <span>Miễn phí</span>
          </div>
          <div className="flex justify-between">
            <span>Thuế</span>
            <span>Đã bao gồm</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mt-2">
            <span>Cần thanh toán</span>
            <span className="money">
              {formatMoney(total - totalDiscounted)}
            </span>
          </div>
          <p className="text-green-700 text-sm text-right font-medium money">
            {" "}
            tiết kiệm được {formatMoney(totalDiscounted)}{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
