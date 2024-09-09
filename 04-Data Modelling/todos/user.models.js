import mongoose from "mongoose";

//schema is a method that take object
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true, //will not save without this field even if you dont check in user controller
      unique: true, //will take only unique value
      lowercase: true, //will take lowercase only
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"], //custom error message (validation)
    },
  },
  {
    //in second object after defining structure
    //to store when user come,modified etc(TIMESTAMPS)
    timestamps: true,
    //createdAt and updatedAt are created by default
  }
);

export default User = mongoose.model("User", userSchema);
//model name , kiske basis pe ban
// .model("User")
//becomes plural and lowercase
//users in monodb
