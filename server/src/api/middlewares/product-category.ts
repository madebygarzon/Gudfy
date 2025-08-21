import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/product-category",
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

export default upload;
