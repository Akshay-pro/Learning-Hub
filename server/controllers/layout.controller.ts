import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import layoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

export const createLayout = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type } = req.body;
            const isTypeExist = await layoutModel.findOne({ type });

            if (isTypeExist) {
                return next(new ErrorHandler(`${type} already exist`, 400));
            }
            if (type === "Banner") {
                const { image, title, subTitle } = req.body;

                const myCloud = await cloudinary.v2.uploader.upload(image, {
                    folder: "layout",
                });
                const banner = {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.url,
                    },
                    title,
                    subTitle,
                };
                await layoutModel.create(banner);
            }

            if (type === "FAQ") {
                const { faq } = req.body;
                const faqItems = await Promise.all(
                    faq.map(async (item: any) => {
                        return {
                            question: item.question,
                            answer: item.answer,
                        };
                    })
                );
                await layoutModel.create({
                    type: "FAQ",
                    faq: faqItems,
                });
            }

            if (type === "Categories") {
                const { categories } = req.body;

                const categoriesItems = await Promise.all(
                    categories.map(async (item: any) => {
                        return {
                            title: item.title,
                        };
                    })
                );
                await layoutModel.create({
                    type: "Categories",
                    categories: categoriesItems,
                });
            }

            res.status(201).json({
                success: true,
                message: "Layout created successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//edit layout
export const editLayout = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type } = req.body;

            if (type === "Banner") {
                const bannerData: any = await layoutModel.findOne({
                    type: "Banner",
                });
                const { image, title, subTitle } = req.body;

                await cloudinary.v2.uploader.destroy(
                    bannerData.image.public_id
                );

                const myCloud = await cloudinary.v2.uploader.upload(image, {
                    folder: "layout",
                });
                const banner = {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.url,
                    },
                    title,
                    subTitle,
                };
                await layoutModel.findByIdAndUpdate(bannerData._id, { banner });
            }

            if (type === "FAQ") {
                const { faq } = req.body;
                const faqData = await layoutModel.findOne({ type: "FAQ" });
                const faqItems = await Promise.all(
                    faq.map(async (item: any) => {
                        return {
                            question: item.question,
                            answer: item.answer,
                        };
                    })
                );
                await layoutModel.findByIdAndUpdate(faqData?._id, {
                    type: "FAQ",
                    faq: faqItems,
                });
            }

            if (type === "Categories") {
                const { categories } = req.body;
                const categoriesData = await layoutModel.findOne({
                    type: "Categories",
                });
                const categoriesItems = await Promise.all(
                    categories.map(async (item: any) => {
                        return {
                            title: item.title,
                        };
                    })
                );
                await layoutModel.findByIdAndUpdate(categoriesData?._id, {
                    type: "Categories",
                    categories: categoriesItems,
                });
            }

            res.status(201).json({
                success: true,
                message: "Layout edited successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//get layout by type
export const getLayoutByType = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type } = req.body;
            const layout = await layoutModel.findOne({ type });

            res.status(201).json({
                success: true,
                layout,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
