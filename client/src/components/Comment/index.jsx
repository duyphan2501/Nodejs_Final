import { Button, Rating, Stack, TextField } from "@mui/material";
import CommentCard from "../CommentCard";
import useEvaluationStore from "../../store/useEvaluationStore";
import io from "socket.io-client";
import { useState } from "react";
import { useEffect } from "react";
import useUserStore from "../../store/useUserStore";
import { toast } from "react-toastify";
import ConfirmDialog from "../ConfirmDialog.jsx";

const socket = io("http://localhost:3000");

// const comment = {
//   avatar: "https://ecommerce-frontend-view.netlify.app/user.jpg",
//   name: "Duy Phan",
//   date: "2023-10-04",
//   comment: "Best product",
//   rating: 5,
// };

const Comment = ({ product }) => {
  const evaluations = useEvaluationStore((state) => state.evaluations);
  const user = useUserStore((state) => state.user);

  const setEvaluations = useEvaluationStore((state) => state.setEvaluations);

  const [commentText, setCommentText] = useState("");
  const [ratingValue, setRatingValue] = useState(5);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alreadyAdded, setAlreadyAdded] = useState(false);

  const handleSendComment = () => {
    setConfirmOpen(false);
    if (commentText.trim() === "") return;

    socket.emit("newComment", {
      userName: user?.name || "Anonymous",
      comment: commentText,
      rating: ratingValue,
      createdAt: new Date().toISOString(),
      productId: product._id,
    });
  };

  useEffect(() => {
    socket.on("commentAdded", (newComment) => {
      setEvaluations((prev) => [...prev, newComment]);
    });
    socket.on("commentError", (error) => {
      toast.error(error.message);
    });

    return () => {
      socket.off("commentAdded");
      socket.off("commentError");
    };
  }, []);

  useEffect(() => {
    if (user) {
      const hasAdded = evaluations.some((e) => e.userName === user.name);
      setAlreadyAdded(hasAdded);
    }
  }, [evaluations]);

  return (
    <div>
      <ConfirmDialog
        onConfirm={handleSendComment}
        content={
          "Bạn có muốn đăng đánh giá này? Bạn sẽ không thể sửa đổi sau khi đã đăng."
        }
        action={"Đồng ý"}
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <div className="shadow rounded p-5">
        <div className="">
          <h3 className="font-bold text-lg uppercase">
            Phản hồi từ khách hàng
          </h3>
          <div className="p-2 max-h-[400px] overflow-y-scroll">
            {evaluations.length === 0 ? (
              <div>Chưa có đánh giá nào</div>
            ) : (
              evaluations?.map((evaluation) => (
                <CommentCard key={evaluation._id} comment={evaluation} />
              ))
            )}
          </div>
        </div>
        {!alreadyAdded && (
          <div className="p-3 shadow rounded bg-gray-100 my-5">
            <h4 className="text-lg font-bold mb-3">Bình luận</h4>

            <TextField
              id="outlined-basic"
              label="Viết gì đó..."
              variant="outlined"
              className="bg-white w-full mt-3"
              multiline={true}
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            {user && (
              <div className="mb-3">
                <Stack spacing={1}>
                  <Rating
                    size="medium"
                    name="half-rating"
                    precision={0.5}
                    defaultValue={5}
                    value={ratingValue}
                    onChange={(e) => setRatingValue(Number(e.target.value))}
                  />
                </Stack>
              </div>
            )}

            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={commentText.trim() === ""}
              sx={{
                bgcolor: "black",
                color: "white",
                fontWeight: "600",
                "&:hover": { bgcolor: "gray.700" },
                "&.Mui-disabled": {
                  bgcolor: "gray.400",
                  color: "#fff",
                  opacity: 0.7,
                },
              }}
              className="!mt-3"
            >
              Đánh giá
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
