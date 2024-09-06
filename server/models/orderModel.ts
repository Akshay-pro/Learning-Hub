import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";

export interface IOrder extends Document {
    courseId: string;
    userId: string;
    payment_info: object;
}

const userSchema: Schema<IOrder> = new mongoose.Schema(
    {
        courseId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        payment_info: {
            type: Object,
        },
    },
    { timestamps: true }
);

const orderModel: Model<IOrder> = mongoose.model("order", userSchema);

export default orderModel;
