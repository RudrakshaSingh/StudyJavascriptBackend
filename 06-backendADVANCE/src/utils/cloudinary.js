import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//localFilePath is a url
const uploadOnCloudinary = async (localFilePath) => {
    try {
        //if filepath not there
        if (!localFilePath) return null

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",//audio,vedio
            folder: "youtubeHitesh",
        })
        // file has been uploaded successfully

        //response.url is publuic url after upload
        //console.log("file is uploaded on cloudinary ", response.url);
        
        fs.unlinkSync(localFilePath)//remove from temp folder
        return response;//returning url response

    } catch (error) {//file not uploaded
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

//unlink
//and unlinkSync
//unlinkSync = means  synchrnously will not go forward before it is done 

export {uploadOnCloudinary}