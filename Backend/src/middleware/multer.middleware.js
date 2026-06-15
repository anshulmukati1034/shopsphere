import multer from "multer";
import { AppError } from "../utils/AppError.js";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const fileFilter = (_req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new AppError("Only JPG, PNG, and WEBP files are allowed.", 400), false);
  }
  cb(null, true);
};

const multerInstance = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

/**
 * Wraps multer.any() so routes can still call upload.single(fieldName).
 * Normalises req.file and req.files regardless of how many files arrive.
 */
const singleOrMultiple = (fieldName) => {
  const anyMiddleware = multerInstance.any();

  return (req, _res, next) => {
    anyMiddleware(req, _res, (err) => {
      if (err) return next(err);

      const allFiles = Array.isArray(req.files) ? req.files : [];
      const matched = allFiles.filter((f) => f.fieldname === fieldName);
      const chosen = matched.length > 0 ? matched : allFiles;

      req.files = chosen;
      req.file = chosen[0] ?? null;

      next();
    });
  };
};

export const upload = {
  single: singleOrMultiple,
  array: multerInstance.array.bind(multerInstance),
  fields: multerInstance.fields.bind(multerInstance),
  any: multerInstance.any.bind(multerInstance),
};

/** Must sit immediately after any multer middleware in the chain. */
export const handleMulterError = (err, _req, res, next) => {
  if (!(err instanceof multer.MulterError)) return next(err);

  const multerMessages = {
    LIMIT_FILE_SIZE: "File size exceeds the 2 MB limit.",
    LIMIT_FILE_COUNT: "Too many files uploaded.",
    LIMIT_UNEXPECTED_FILE: "Unexpected field name in the upload.",
  };

  const message = multerMessages[err.code] ?? "File upload error.";
  return res.status(400).json({ success: false, message });
};