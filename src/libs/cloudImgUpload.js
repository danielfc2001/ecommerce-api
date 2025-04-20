import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { createHash } from "crypto";

export const cloudImgUpload = async (fileBuffer) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    // const uniquePublicId = `product_${uuidv4()}`;

    const uniqueId = createHash("sha256", `${Date.now()} ${Math.random()}`);

    // Wrap the upload in a Promise to handle the stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          public_id: uniqueId.digest("hex").slice(0, 24),
          unique_filename: false,
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Convert the buffer to a readable stream and pipe it to Cloudinary
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading image to Cloudinary: " + error.message);
  }
};
