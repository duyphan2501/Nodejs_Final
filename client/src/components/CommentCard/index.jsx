import { Rating, Stack } from "@mui/material";
import formatDate from "../../utils/DateFormat";

const CommentCard = ({ comment }) => {
  const date = formatDate(comment.createdAt);
  return (
    <div className="border-b py-4 border-gray-300 flex justify-between">
      <div className="flex gap-3 flex-1">
        <div className="size-[60px] rounded-full overflow-hidden">
          <img
            src={"https://ecommerce-frontend-view.netlify.app/user.jpg"}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div className="">
            <p className="font-semibold">{comment.userName}</p>
            <p className="text-sm">{date}</p>
          </div>
          <p>{comment.comment}</p>
        </div>
      </div>
      <div className="">
        <Stack spacing={1}>
          <Rating
            size="small"
            name="half-rating"
            value={comment.rating}
            precision={0.5}
            readOnly
          />
        </Stack>
      </div>
    </div>
  );
};

export default CommentCard;
