import cron from "node-cron";
import OrderModel from "./models/order.model.js";

class FakeDeliveryCron {
  constructor() {
    this.isRunning = false;
  }

  // Chạy mỗi 1 phút để cập nhật trạng thái đơn hàng
  start() {
    if (this.isRunning) {
      console.log("Fake delivery cron is already running");
      return;
    }

    // Chạy mỗi phút: '* * * * *'
    this.job = cron.schedule("* * * * *", async () => {
      try {
        await this.updateOrderStatuses();
      } catch (error) {
        console.error("Error in fake delivery cron:", error);
      }
    });

    this.isRunning = true;
    console.log("Fake delivery cron started - running every 1 minute");
  }

  async updateOrderStatuses() {
    try {
      const now = new Date();

      // Lấy tất cả đơn hàng chưa delivered
      const orders = await OrderModel.find({
        status: { $ne: "delivered" },
      });

      for (const order of orders) {
        const createdAt = new Date(order.createdAt);
        const minutesSinceCreated = Math.floor((now - createdAt) / (1000 * 60));

        let newStatus = order.status;

        // Logic chuyển trạng thái:
        // - 0-1 phút: pending
        // - 1-2 phút: confirmed
        // - 2-3 phút: shipping
        // - 3+ phút: delivered (sau 5 phút tính từ lúc tạo = 3 phút sau pending)

        if (minutesSinceCreated >= 3 && order.status === "shipping") {
          newStatus = "delivered";
        } else if (minutesSinceCreated >= 2 && order.status === "confirmed") {
          newStatus = "shipping";
        } else if (minutesSinceCreated >= 1 && order.status === "pending") {
          newStatus = "confirmed";
        }

        // Cập nhật nếu có thay đổi
        if (newStatus !== order.status) {
          order.status = newStatus;
          await order.save();
          console.log(
            `Order ${order.orderId} status updated: ${order.status} -> ${newStatus}`
          );
        }
      }
    } catch (error) {
      console.error("Error updating order statuses:", error);
    }
  }

  stop() {
    if (this.job) {
      this.job.stop();
      this.isRunning = false;
      console.log("Fake delivery cron stopped");
    }
  }

  // Manual trigger để test
  async trigger() {
    console.log("Manually triggering fake delivery update...");
    await this.updateOrderStatuses();
  }
}

export default new FakeDeliveryCron();
