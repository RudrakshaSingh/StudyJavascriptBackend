import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// const generateAccessAndRefereshTokens = async (userId) => {
//    try {
//       const user = await User.findById(userId);
//       const accessToken = user.generateAccessToken();
//       const refreshToken = user.generateRefreshToken();

//       user.refreshToken = refreshToken;
//       await user.save({ validateBeforeSave: false });

//       return { accessToken, refreshToken };
//    } catch (error) {
//       throw new ApiError(
//          500,
//          "Something went wrong while generating referesh and access token"
//       );
//    }
// };

const registerUser = asyncHandler(async (req, res) => {
   // get user details from frontend
   // validation - eg.not empty
   // check if user already exists: username, email
   // check for images, check for avatar
   // upload them to cloudinary, avatar
   // create user object - create entry in db
   // remove password and refresh token field from response
   // check for user creation
   // if created,return res

   //postman will be stucj if you will not close the response in request

   //============================================================================
   //if data is in form,body,url,json  we get from req.body not for url
   const { fullName, email, username, password } = req.body;
   //    console.log("email: ", email);

   //some accept upto 3 values,check with condition it return true or false
   if (
      //chech all at once
      //.some function if empty even after trim it returb true
      [fullName, email, username, password].some(
         (field) => field?.trim() === ""
      )
   ) {
      throw new ApiError(400, "All fields are required");
   }
   //============================================================================

   const existedUser = await User.findOne({
      $or: [{ username }, { email }],
   });

   if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
   }
   //console.log(req.files);

   //============================================================================

   //multer gives req.files access
   //   ? optinally chaining because as it may or may not exist
   //    [0] first property to path
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   //    if (
   //       req.files &&
   //       Array.isArray(req.files.coverImage) &&
   //       req.files.coverImage.length > 0
   //    ) {
   //       coverImageLocalPath = req.files.coverImage[0].path;
   //    }

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
   }

   //await s used when you dont move forward before it completes
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if (!avatar) {
      throw new ApiError(400, "Avatar file is required.not uploaded");
   }

   //============================================================================

   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "", //as cover image not compulsary
      email,
      password,
      username: username.toLowerCase(),
   });

   //_id automatically generated //remove password and token
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   );

   if (!createdUser) {
      throw new ApiError(
         500,
         "Something went wrong while registering the user"
      );
   }

   //============================================================================

   return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export { registerUser };
