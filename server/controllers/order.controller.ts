import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import orderModel, { IOrder } from "../models/orderModel";
import userModel from "../models/userModel";
import courseModel from "../models/courseModel";
import notificationModel from "../models/notificationModel";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import { getAllOrderServices, newOrder } from "../services/order.service";

export const createOrder = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courseId, payment_info } = req.body as IOrder;
            const user = await userModel.findById(req.user._id);

            const courseExist = user?.courses.some(
                (course: any) => course._id.toString() === courseId
            );

            if (courseExist) {
                return next(
                    new ErrorHandler(
                        "You have already purchased this course",
                        400
                    )
                );
            }

            const course = await courseModel.findById(courseId);

            if (!course) {
                return next(new ErrorHandler("Course Not Found", 400));
            }
            const data: any = {
                courseId: course._id,
                userId: user?._id,
            };

            const mailData: any = {
                order: {
                    _id: course._id.toString().slice(0, 6),
                    name: course.name,
                    price: course.price,
                    data: new Date().toLocaleDateString("en-Us", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }),
                },
            };

            const html = await ejs.renderFile(
                path.join(__dirname, "../mails/order-confirmation.ejs"),
                { order: mailData }
            );

            try {
                if (user) {
                    await sendMail({
                        email: user.email,
                        subject: "Order Confirmation",
                        template: "order-confirmation.ejs",
                        data: mailData,
                    });
                }
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 500));
            }

            user?.courses.push(course?._id);
            await user?.save();

            await notificationModel.create({
                user: user?._id,
                title: "New Order",
                message: `You have a new order ${course?.name}`,
            });

            if (course.purchased !== undefined) {
                course.purchased += 1;
            } else {
                course.purchased = 1;
            }
            
            await course.save();

            newOrder(data, res, next);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//get all orders (admin only)
export const getAllOrders = CatchAsyncError(
    (req: Request, res: Response, next: NextFunction) => {
        try {
            getAllOrderServices(res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);