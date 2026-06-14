import multer from "multer";

// memory storage (required for cloudinary)
const storage = multer.memoryStorage();

// file filter (validation)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, WEBP files allowed"), false);
  }

  cb(null, true);
};

// limits
const limits = {
  fileSize: 2 * 1024 * 1024, // 2MB
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});