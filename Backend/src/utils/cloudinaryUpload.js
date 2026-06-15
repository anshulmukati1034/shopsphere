import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import { AppError } from "./AppError.js";

export const uploadToCloudinary = (buffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          return reject(
            new AppError(`Cloudinary upload failed: ${error.message}`, 502),
          );
        }
        resolve(result);
      },
    );

    Readable.from(buffer).pipe(stream);
  });
};

export const uploadManyToCloudinary = async (buffers, folder = "uploads") => {
  const results = await Promise.all(
    buffers.map((buf) => uploadToCloudinary(buf, folder)),
  );
  return results.map((r) => r.secure_url);
};