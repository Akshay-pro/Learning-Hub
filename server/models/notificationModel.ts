import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";

export interface INotification extends Document {
    title: string;
    message: string;
    status: string;
    userId: string;
}

const userSchema: Schema<INotification> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "unread",
        },
    },
    { timestamps: true }
);

const notificationModel: Model<INotification> = mongoose.model(
    "notification",
    userSchema
);

export default notificationModel;
