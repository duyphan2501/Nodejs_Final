import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export default function StarRate({ star, quantity }) {
  const fullStars = Math.floor(star);
  const halfStar = star % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {/* Sao đầy */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon key={`full-${i}`} sx={{ color: "#E5BD37" }} />
      ))}

      {/* Nửa sao */}
      {halfStar && <StarHalfIcon sx={{ color: "#E5BD37" }} />}

      {/* Sao trống */}
      {Array.from({ length: 5 - Math.ceil(star) }).map((_, i) => (
        <StarOutlineIcon key={`empty-${i}`} sx={{ color: "#E5BD37" }} />
      ))}

      {/* Số lượng đánh giá */}
      <p className="text-md italic ml-2">{quantity}</p>
    </div>
  );
}
