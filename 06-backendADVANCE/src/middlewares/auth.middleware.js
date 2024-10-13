import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

//req.cookies give acces to cookies because of cookie parser in app.js
export const verifyJWT = asyncHandler(async(req, _, next) => {//AS WE ARE NOT USING RES WE PUT _
    try {

        //cookie may  or may not have access token
        //as we had send access token as json   
        //user may had access token in his custom header

        //in post in header
        //key=Authrization and value =Bearer <token>   //remove bearer space 
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        //decode info from token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user; //request ke andar naya object add krdia user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})