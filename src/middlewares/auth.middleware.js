import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const verifyUser = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(400, "Unauthorized Access");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
  const user = await User.findById({ _id: decodedToken._id });

  if (!user) {
    throw new ApiError(400, "Invalid access token");
  }
  req.user = user;

  next();
});


export { verifyUser }