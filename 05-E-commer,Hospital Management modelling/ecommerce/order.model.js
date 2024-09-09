import mongoose from "mongoose";
import { Product } from "./product.model";

//mini models dont export
const orderItemsSchema = new mongoose.Schema({
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  orderPrice: {
    type: Number,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [orderItemsSchema],
  //can also do
  //   orderItems: [
  //     {
  //       ProductId: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "Product",
  //         required: true,
  //       },
  //       quantity: {
  //         type: Number,
  //         required: true,
  //       },
  //     },
  //   ],
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum:["pending","delivered","cancelled"],//can only choose between these 3 casesensitive
    default:"pending"
  },
});

export const Order = mongoose.model("Order", orderSchema);
