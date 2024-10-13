import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//function to generate acess and refresh token simultaneously
const generateAccessAndRefereshTokens = async (userId) => {
   try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });//SO THAT YOU DONT NEED TO GIVE PASSWORD AND USERNAME WHICH ARE REQUIRED 

      return { accessToken, refreshToken };
   } catch (error) {
      throw new ApiError(
         500,
         "Something went wrong while generating referesh and access token"
      );
   }
};

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

   //it may give undefined which can cause error
   // const coverImageLocalPath = req.files?.coverImage[0]?.path;
   let coverImageLocalPath;
   // req.files aya ya nhi  //req.files.coverImage me array hai ya nhi
   //array ki length  0 se jada hai
   if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
   ) {
      coverImageLocalPath = req.files.coverImage[0].path;
   }

   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
   }

   //await s used when you dont move forward before it completes
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);//agar nhi milli toh cloudinary empty string return kar deta hai

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

const loginUser=asyncHandler(async(req,res)=>{
    //req body -> data
    //acces base on username or email
    //check user exists or not
    //password match
    //generate access and refresh token
    //send refresh and access token  as cookies

    const {email,username,password}=req.body;

    if (!email && !username) {
      throw new ApiError(400, "Email or username is required");
    }

    const user=await User.findOne({$or:[{email},{username}]});

    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid user credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    //REFRESH TOKEN IS STILL EMPTY AS REFRENCE IS OF BEFORE REFRESH TOKEN AND ACCESSMWTHOD 
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")//DONT NEED TO GIVE THESE TO USER MODEL

    //COOKIES
    const options = {
        httpOnly: true,//by deafault by default in frontend cookie are modifiable
        secure: true,//these both make sure these cookies are not modifible by frontend only modifiable by server
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options) //by cookie.parser
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },//we sending token if user want to save it in local storage
            "User logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
   //we dont have _id here but we cant make a form to enter email to logout
   //but then he can logout anyone by entering their email
   
   //we use middleware to check if user is logged in or not

   //clear cookies can only be managed by server
   //remove refresh token in db

   await User.findByIdAndUpdate(
       req.user._id,
       {
           $unset: {
               refreshToken: 1 // this removes the field from document
           }
       },
       {
           new: true //return me response me new updated value milegi, not storing in variable here
       }
   )

   const options = {
       httpOnly: true,
       secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
   //user send refresh token in cookies


   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if (!incomingRefreshToken) {
       throw new ApiError(401, "unauthorized request")
   }

   try {
       const decodedToken = jwt.verify(
           incomingRefreshToken,
           process.env.REFRESH_TOKEN_SECRET
       )
   
       const user = await User.findById(decodedToken?._id)
   
       if (!user) {
           throw new ApiError(401, "Invalid refresh token")
       }
   
       if (incomingRefreshToken !== user?.refreshToken) {
           throw new ApiError(401, "Refresh token is expired or used")
           
       }
   
       const options = {
           httpOnly: true,
           secure: true
       }
   
       const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
   
       return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", newRefreshToken, options)
       .json(
           new ApiResponse(
               200, 
               {accessToken, refreshToken: newRefreshToken},
               "Access token refreshed"
           )
       )
   } catch (error) {
       throw new ApiError(401, error?.message || "Invalid refresh token")
   }

})

export { registerUser, loginUser,logoutUser,refreshAccessToken  };
