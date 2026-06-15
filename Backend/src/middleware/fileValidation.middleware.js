export const validateFiles =
  ({ required = false, maxFiles = 5 } = {}) =>
  (req, res, next) => {
    const files =
      Array.isArray(req.files) && req.files.length > 0
        ? req.files
        : req.file
          ? [req.file]
          : [];

    if (required && files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }

    if (files.length > maxFiles) {
      return res.status(400).json({
        success: false,
        message: `Too many files. Maximum allowed is ${maxFiles}.`,
      });
    }

    for (const file of files) {
      if (!file?.buffer || file.buffer.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "One or more files are empty." });
      }
    }

    // Normalise: downstream always reads req.uploadedFiles
    req.uploadedFiles = files;

    next();
  };
