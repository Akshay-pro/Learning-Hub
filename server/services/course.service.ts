import { Response } from "express";
import courseModel from "../models/courseModel";
import { CatchAsyncError } from "../middleware/catchAsyncError";

//course service
export const createCourse = CatchAsyncError(
    async (data: any, res: Response) => {
        const course = await courseModel.create(data);
        res.status(201).json({
            success: true,
            course,
        });
    }
);

//get all courses
export const getAllCoursesService = async (res: Response) => {
    const course = await courseModel.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        course,
    });
};

