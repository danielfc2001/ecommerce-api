import { v2 as cloudinary } from "cloudinary";

export const cloudImgRemove = async (id) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = cloudinary.uploader.destroy(
      id,
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Error removing image from Cloudinary:", error);
          throw new Error(
            "Error removing image from Cloudinary: " + error.message
          );
        }
        console.log("Image removed from Cloudinary:", result);
        return result;
      }
    );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error removing image from Cloudinary: " + error.message);
  }
};
