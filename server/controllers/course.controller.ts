import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/userModel";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import "dotenv/config";
import { redis } from "../utils/redis";
import cloudinary from "cloudinary";
import ejs from "ejs";
import path from "path";
import { createCourse, getAllCoursesService } from "../services/course.service";
import courseModel from "../models/courseModel";
import mongoose from "mongoose";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notificationModel";
import { getAllUsersService } from "../services/user.service";

//upload course
export const uploadCourse = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const thumbnail = data.thumbnail;
            if (thumbnail) {
                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "courses",
                });

                data.thumbnail = {
                    publicId: myCloud.public_id,
                    url: myCloud.url,
                };
            }

            createCourse(data, res, next);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// edit course
export const editCourse = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;

            const thumbnail = data.thumbnail;
            if (thumbnail) {
                await cloudinary.v2.uploader.destroy(thumbnail.public_id);

                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "courses",
                });

                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }

            const courseId = req.params.id;

            const course = await courseModel.findByIdAndUpdate(
                courseId,
                { $set: data },
                { new: true }
            );

            res.status(201).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get single course  --No purchase
export const getSingleCourse = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courseId = req.params.id;

            const isCacheExist = await redis.get(courseId);

            if (isCacheExist) {
                const course = JSON.parse(isCacheExist);
                return res.status(201).json({
                    success: true,
                    course,
                });
            } else {
                const course = await courseModel
                    .findById(courseId)
                    .select(
                        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
                    );

                await redis.set(courseId, JSON.stringify(course), "EX", 604800);

                return res.status(201).json({
                    success: true,
                    course,
                });
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get all courses
export const getAllCourses = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const isCacheExist = await redis.get("allCourses");
            if (isCacheExist) {
                const courses = JSON.parse(isCacheExist);
                return res.status(201).json({
                    success: true,
                    courses,
                });
            } else {
                const courses = await courseModel
                    .find()
                    .select(
                        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
                    );
                await redis.set("allCourses", JSON.stringify(courses));
                return res.status(201).json({
                    success: true,
                    courses,
                });
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get course for valid user
export const getCourseByUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userCourseList = req.user?.courses;
            const courseId = req.params.id;
            const courseExist = userCourseList?.find(
                (course: any) => course._id.toString() === courseId
            );

            if (!courseExist) {
                return next(
                    new ErrorHandler(
                        "You are no eligible to access this course",
                        400
                    )
                );
            }

            const course = await courseModel.findById(courseId);

            const content = course?.courseData;

            return res.status(201).json({
                success: true,
                content,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// add question in course
interface IAddQuestion {
    question: string;
    courseId: string;
    contentId: string;
}

export const addQuestion = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { question, courseId, contentId }: IAddQuestion = req.body;

            const course = await courseModel.findById(courseId);
            if (!mongoose.Types.ObjectId.isValid(contentId)) {
                return next(new ErrorHandler("Invalid content Id", 400));
            }

            const courseContent = course?.courseData?.find((item: any) =>
                item._id.equals(contentId.toString())
            );
            if (!courseContent) {
                return next(new ErrorHandler("Invalid content id", 400));
            }

            const newQuestion: any = {
                user: req?.user,
                question,
                questionReplies: [],
            };

            await notificationModel.create({
                user: req.user._id,
                title: "New Question Recieved",
                message: `You have a new question in ${courseContent?.title}`,
            });
            // add to course content
            courseContent.questions.push(newQuestion);

            await course?.save();

            res.status(200).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// add answer in course question
interface IAddAnswerData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}

export const addAnswer = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { answer, courseId, contentId, questionId }: IAddAnswerData =
                req.body;

            const course = await courseModel.findById(courseId);

            if (!mongoose.Types.ObjectId.isValid(contentId)) {
                return next(new ErrorHandler("Invalid content Id", 400));
            }

            const courseContent = course?.courseData?.find((item: any) =>
                item._id.equals(contentId.toString())
            );

            if (!courseContent) {
                return next(new ErrorHandler("Invalid content id", 400));
            }

            if (!mongoose.Types.ObjectId.isValid(questionId)) {
                return next(new ErrorHandler("Invalid content Id", 400));
            }

            const questionContent = courseContent?.questions?.find(
                (item: any) => item._id.equals(questionId.toString())
            );

            if (!questionContent) {
                return next(new ErrorHandler("Invalid question id", 400));
            }

            const newAnswer: any = {
                user: req.user,
                answer,
            };

            questionContent.questionReplies.push(newAnswer);
            await course?.save();

            if (req.user?._id === questionContent.user?._id) {
                //create notification to dashboard
                await notificationModel.create({
                    user: req.user._id,
                    title: "New Question Reply Added",
                    message: `You have a new question reply in ${courseContent?.title}`,
                });
            } else {
                const data = {
                    name: questionContent.user.name,
                    title: courseContent.title,
                };

                const html = await ejs.renderFile(
                    path.join(__dirname, "../mails/question-reply.ejs"),
                    data
                );

                try {
                    await sendMail({
                        email: questionContent.user.email,
                        subject: "question reply",
                        template: "question-reply.ejs",
                        data,
                    });
                } catch (error: any) {
                    return next(new ErrorHandler(error.message, 500));
                }
            }

            res.status(200).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//async review in course
interface IAddReviewData {
    review: string;
    courseId: string;
    rating: number;
    userId: string;
}

export const addReview = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userCouresList = req.user?.courses;

            const courseId = req.params.id;
            //check if course already exist in user course list
            const courseExists = userCouresList?.find(
                (course: any) => course._id.toString() === courseId
            );

            if (!courseExists) {
                return next(
                    new ErrorHandler(
                        "You are not eligible to access this course",
                        404
                    )
                );
            }

            const course = await courseModel.findById(courseId);

            const { review, rating } = req.body;

            const reviewData: any = {
                user: req.user,
                comment: review,
                rating,
            };

            course?.reviews.push(reviewData);

            let avg = 0;
            course?.reviews.forEach((rev: any) => {
                avg += rev.rating;
            });

            if (course) {
                course.ratings = avg / course?.reviews.length;
            }

            await course?.save();

            const notification = {
                title: "New Review Recieved",
                message: `${req?.user.name} has given a review in ${course?.name}`,
            };

            //create notification

            res.status(200).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//add reply in reviews
interface IAddReviewData {
    comment: string;
    courseId: string;
    reviewId: string;
}
export const addReplyToReview = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { comment, courseId, reviewId } = req.body as IAddReviewData;

            const course = await courseModel.findById(courseId);
            if (!course) {
                return next(new ErrorHandler("Course Not Found", 404));
            }

            const review = course?.reviews?.find(
                (rev: any) => rev._id.toString() == reviewId
            );

            if (!review) {
                return next(new ErrorHandler("Review not found", 404));
            }

            const replyData: any = {
                user: req.user,
                comment,
            };

            review.commentReplies.push(replyData);

            await course.save();

            res.status(200).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//get all courses (admin only)
export const getAllCourse = CatchAsyncError(
    (req: Request, res: Response, next: NextFunction) => {
        try {
            getAllCoursesService(res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//delete course (admin only)
export const deleteCourse = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const course = await courseModel.findById(id);
            if (!course) {
                return next(new ErrorHandler("Course not found", 404));
            }

            await course.deleteOne({ id });
            await redis.del(id);

            res.status(200).json({
                success: true,
                message: "Course deleted successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
