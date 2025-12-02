import { Rating, Stack } from "@mui/material";
import formatDate from "../../utils/DateFormat";

const StarCard = ({ starRateData }) => {
  const date = formatDate(starRateData.createdAt);

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

        <div className="flex flex-row justify-between items-center gap-3">
          <div>
            <p className="font-semibold">{starRateData.userName}</p>
            <p className="text-sm text-gray-600">{date}</p>
          </div>

          <Rating
            value={starRateData.rating}
            readOnly
            precision={0.5}
            size="medium"
          />
        </div>
      </div>
    </div>
  );
};

export default StarCard;
