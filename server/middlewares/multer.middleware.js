import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// const storage = multer.diskStorage({
//   destination: "uploads/images/",
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ext);
//   },
// });

const upload = multer({ dest: "uploads/images/" });
export const uploadSingleImage = upload.single("image");
