import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folder = "others") => {
  try {
    if (!localFilePath) return null;
    const res = await cloudinary.uploader.upload(localFilePath, {
      folder: folder,
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return res;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("Error in uploadOnCloudinary :: ", error);
  }
};

export { uploadOnCloudinary };
