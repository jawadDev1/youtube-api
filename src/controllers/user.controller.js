import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/uploadFile.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Generate Access and Refresh token
const generateAccessAndRefreshToken = async (_id) => {
  try {
    const user = await User.findById({ _id });
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error in generateAccessAndRefreshToken :: ", error);
    throw new ApiError(500, "Token is not generated");
  }
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (
    [fullName, email, username, password].some(
      (field) => field?.trim() === "" || field?.trim() === undefined
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  const avatarLoalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }

  if (!avatarLoalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLoalPath, "avatars");
  const coverImage = await uploadOnCloudinary(
    coverImageLocalPath,
    "coverImages"
  );

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong, User is not created");
  }

  res
    .status(201)
    .json(new ApiResponse(true, "User is created Successfully", createdUser));
});

//  Login the user
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const isCorrectPassword = await user.isCorrectPassword(String(password));

  if (!isCorrectPassword) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(true, "Logged in Successfully", {
        accessToken,
        refreshToken,
        user: loggedInUser,
      })
    );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(true, "LoggedOut Successfully", {}));
});

export { registerUser, loginUser, logoutUser };
