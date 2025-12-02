// socket.config.js
import { Server } from "socket.io";
import {
  addEvaluationComment,
  addEvaluationRating,
} from "../services/evaluation.service.js";

let io;
let initPromise;

export const initSocket = (server) => {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve) => {
    console.log("Initializing Socket.io...");
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      // console.log("New client connected:", socket.id);

      socket.on("newComment", async (data) => {
        try {
          const { userName, rating, comment, productId } = data;
          const result = await addEvaluationComment(
            userName,
            comment,
            productId
          );
          io.emit("commentAdded", data);
        } catch (error) {
          socket.emit("commentError", {
            message: "Không thể thêm đánh giá. Vui lòng thử lại.",
          });
        }
      });

      socket.on("newRating", async (data) => {
        try {
          const { userName, rating, productId } = data;
          const result = await addEvaluationRating(userName, rating, productId);
          io.emit("ratingAdded", data);
        } catch (error) {
          socket.emit("ratingError", {
            message: "Không thể thêm đánh giá. Vui lòng thử lại.",
          });
        }
      });
    });

    resolve(io);
  });

  return initPromise;
};
