const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/tickets",
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

export default upload;
