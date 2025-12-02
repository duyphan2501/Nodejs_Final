import { TextField } from "@mui/material";
import StackButton from "../../components/StackButton";
import { useState } from "react";
import OrderTrackingResult from "../../components/OrderTrackingResult";
import useOrderStore from "../../store/useOrderStore";

const OrderTracker = () => {
  const [currentOrder, setCurrentOrder] = useState({});
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const getOrderById = useOrderStore((s) => s.getOrderById);

  const handleSubmit = async (orderId) => {
    try {
      if (orderId === "") return;
      setLoading(true);
      const orderDetail = await getOrderById(orderId);
      setCurrentOrder(orderDetail);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full md:w-1/2">
            <h1 className="uppercase text-3xl mt-3 font-bold">
              tra cứu đơn hàng
            </h1>
            <p className="text-gray-700 mt-3">
              Bạn có thể điền <b>Mã Đơn Hàng</b> để xem trạng thái đơn hàng hiện
              tại. Nếu bạn muốn hủy đơn hàng khi chưa có tài khoản,{" "}
              <i>
                <b>hãy liên hệ với chúng qua hotline</b>
              </i>
              .
            </p>
            <h1 className="uppercase text-xl mt-20 mb-4 font-bold">
              Mã đơn hàng của bạn là gì?
            </h1>
            <TextField
              id="outlined-basic"
              label="Tra cứu"
              variant="outlined"
              type="text"
              value={orderId}
              placeholder="Email hoặc Mã đơn hàng"
              className="w-full"
              onChange={(e) => setOrderId(e.target.value)}
            />

            <div className="h-10"></div>

            <StackButton
              handleClick={() => handleSubmit(orderId)}
              label={"Tra Cứu"}
              theme="dark"
            />
          </div>

          <div className="w-full">
            <OrderTrackingResult
              loading={loading}
              currentOrder={currentOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;
