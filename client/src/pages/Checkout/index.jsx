import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import useCartStore from "../../store/useCartStore";
import CheckoutItem from "../../components/CheckoutItem";
import { formatMoney } from "../../utils/formatMoney";
import PromoCode from "../../components/PromoCode";
import PurchasePointForm from "../../components/PurchasePointForm";
import { toast } from "react-toastify";
import GuestAddress from "../../components/Address/GuestAddress";
import useOrderStore from "../../store/useOrderStore";
import {
  calculateItemsDiscounted,
  calculateTotal,
} from "../../utils/calculatePrice";
import AddressList from "../../components/Address/AddressList";
import useAddressStore from "../../store/useAddressStore";

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);
  const steps = [
    { id: 1, title: "Thông tin liên hệ" },
    { id: 2, title: "Thông tin giao hàng" },
    { id: 3, title: "Xác nhận và thanh toán" },
  ];

  const [coupon, setCoupon] = useState({ couponCode: null, amountReduced: 0 });
  const [usedPoint, setUsedPoint] = useState({ point: 0, amountReduced: 0 });
  const user = useUserStore((state) => state.user);
  const cartItems = useCartStore((state) => state.cartItems);

  const { createOrder, isLoading } = useOrderStore();
  const addresses = useAddressStore((state) => state.addresses);

  const total = calculateTotal(cartItems);
  const itemsDiscounted = calculateItemsDiscounted(cartItems);
  const orderAmount = total - coupon.amountReduced - usedPoint.amountReduced;

  const [formData, setFormData] = useState({
    email: user?.email || "",
    address: {
      receiver: "",
      phone: "",
      province: "",
      ward: "",
      addressType: "home",
      addressDetail: "",
      isDefault: false,
    },
    provider: "cod",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSetAddress = (addr) => {
    if (checkValidAddress(addr)) {
      handleChange("address", addr);
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
    if (currentStep === 1 && step !== 1)
      if (!checkEmail(formData.email)) {
        toast.error("Email không hợp lệ");
        return;
      }
    if (currentStep === 2) {
      if (!checkValidAddress(formData.address)) {
        setCompletedStep(1);
        if (step === 3) {
          toast.error("Vui lòng cung cấp địa chỉ giao hàng");
          return;
        }
      }
    }
    setCurrentStep(step);
    setCompletedStep((prev) => Math.max(prev, step));
  };

  const handleCompleteOrder = async () => {
    if (isLoading) return;
    await createOrder(
      cartItems,
      formData.email,
      formData.address,
      formData.provider,
      coupon,
      usedPoint,
      orderAmount,
      itemsDiscounted,
      user?._id
    );
  };

  useEffect(() => {
    if (!checkValidAddress(formData.address) && addresses.length > 0) {
      const selected =
        addresses.find((addr) => addr.isDefault === true) || addresses[0];
      handleChange("address", selected);
    }
  }, [addresses]);

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row container">
      {/* Left Section */}
      <div className="w-full lg:w-2/3 p-8">
        <h1 className="text-4xl font-semibold text-[#002B5B] uppercase title mb-6">
          Quy trình thanh toán
        </h1>

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
                    disabled={user?.email}
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
                  {user ? (
                    <>
                      <AddressList
                        title={"Địa chỉ giao hàng"}
                        address={addresses}
                        isCheckout={true}
                        selectedAddress={formData.address}
                        setSelectedAddress={(addr) =>
                          handleChange("address", addr)
                        }
                      />
                      <button
                        onClick={() => handleSetStep(3)}
                        className="w-full bg-[#002B5B] text-white py-3 rounded-lg font-medium cursor-pointer hover:bg-[#003d7a] transition duration-200 mt-6"
                      >
                        Tiếp tục đến bước thanh toán
                      </button>
                    </>
                  ) : (
                    <GuestAddress
                      address={formData.address}
                      setAddress={handleSetAddress}
                    />
                  )}
                </div>
              )}

              {step.id === 3 && currentStep === 3 && (
                <div className="lg:ml-9 mt-4 ">
                  <div className="mb-6">
                    {formData.address ? (
                      <div className="md:ml-7 text-gray-600 leading-relaxed">
                        <div className="flex gap-2">
                          <p className="font-medium">Email:</p>
                          <p>{formData.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <p className="font-medium">Người nhận:</p>
                          <p>
                            <span className="">
                              {formData.address.receiver}
                            </span>{" "}
                            - {formData.address.phone}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <p className="font-medium text-nowrap">Địa chỉ:</p>
                          <p>
                            {formData.address.addressDetail},{" "}
                            {formData.address.ward}, {formData.address.province}
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
                        formData.provider === "cod"
                          ? "border-[#002B5B] bg-[#f3f7fc]"
                          : "border-gray-300 hover:border-[#002B5B]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.provider === "cod"}
                        onChange={() => handleChange("provider", "cod")}
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
                        formData.provider === "payos"
                          ? "border-[#002B5B] bg-[#f3f7fc]"
                          : "border-gray-300 hover:border-[#002B5B]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="payos"
                        checked={formData.provider === "payos"}
                        onChange={() => handleChange("provider", "payos")}
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
                      {isLoading
                        ? "Đang xử lí..."
                        : formData.provider === "payos"
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
          Tóm tắt đơn hàng ({cartItems?.length})
        </h2>

        <div className="space-y-4 max-h-50 overflow-y-auto scroll">
          {cartItems?.map((item) => (
            <CheckoutItem item={item} key={item.variantId + item.size} />
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <PurchasePointForm
            user={user}
            usedPoint={usedPoint}
            setUsedPoint={setUsedPoint}
            maxPoint={Math.floor(orderAmount / 1000)}
          />
          <PromoCode
            couponForOrder={coupon}
            setCouponForOrder={setCoupon}
            orderAmount={orderAmount}
          />
        </div>

        <div className="mt-6 border-t pt-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Tổng cộng</span>
            <span className="money">{formatMoney(total)}</span>
          </div>
          <div className="flex justify-between text-green-700">
            <span>Giảm giá</span>
            <span className="money">
              -{formatMoney(coupon.amountReduced + usedPoint.amountReduced)}
            </span>
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
            <span className="money">{formatMoney(orderAmount)}</span>
          </div>
          <p className="text-green-700 text-sm text-right font-medium money">
            {" "}
            tiết kiệm được{" "}
            {formatMoney(
              itemsDiscounted + coupon.amountReduced + usedPoint.amountReduced
            )}{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
