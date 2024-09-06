import { NextFunction, Response } from "express";
import userModel from "../models/userModel";
import { redis } from "../utils/redis";

export const getUserById = async (id: string, res: Response) => {
    const userJson = await redis.get(id);
    // const user = await userModel.findById(id);
    if (userJson) {
        const user = JSON.parse(userJson);
        res.status(201).json({
            success: true,
            user,
        });
    }
};

//get all users (Admin)
export const getAllUsersService = async (res: Response) => {
    const user = await userModel.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        user,
    });
};

//update user role
export const updateUserRoleService = async (
    res: Response,
    id: string,
    role: string
) => {
    const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
    res.status(201).json({
        success: true,
        user,
    });
};
