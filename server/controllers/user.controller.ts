import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/userModel";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import "dotenv/config";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {
    accessTokenOptions,
    refreshTokenOptions,
    sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import cloudinary from "cloudinary";
import {
    getAllUsersService,
    getUserById,
    updateUserRoleService,
} from "../services/user.service";

interface IRegistrationType {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registrationUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;
            const isEmailExist = await userModel.findOne({ email });
            if (isEmailExist) {
                return next(new ErrorHandler("Email Already Exist", 400));
            }

            const user: IRegistrationType = {
                name,
                email,
                password,
            };

            const activationToken = createActivationToken(user);

            const activationCode = activationToken.activationCode;
            const data = { user: { name: user.name }, activationCode };

            try {
                await sendMail({
                    email: user.email,
                    subject: "Activate your account",
                    template: "activation-mail.ejs",
                    data,
                });

                res.status(201).json({
                    success: true,
                    message: `Please check your email: ${user.email} to activate your account`,
                    activationToken: activationToken.token,
                });
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 500));
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

interface IActivationToken {
    token: string;
    activationCode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        {
            user,
            activationCode,
        },
        process.env.ACTIVATION_SECRET as Secret,
        {
            expiresIn: "5m",
        }
    );

    return { token, activationCode };
};

interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export const activateUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { activation_token, activation_code } =
                req.body as IActivationRequest;
            const newUser: { user: IUser; activationCode: string } = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET as string
            ) as { user: IUser; activationCode: string };

            if (newUser.activationCode !== activation_code) {
                return next(new ErrorHandler("Invalid Activation code", 400));
            }
            const { name, email, password } = newUser.user;

            const existUser = await userModel.findOne({ email });
            if (existUser) {
                return next(new ErrorHandler("User Already Exist", 400));
            }
            const user = await userModel.create({
                name,
                email,
                password,
            });

            res.status(201).json({
                success: true,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//login user

interface ILoginRequest {
    email: string;
    password: string;
}

export const loginUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body as ILoginRequest;
            if (!email || !password) {
                return next(
                    new ErrorHandler(
                        "Please enter valid email and password",
                        400
                    )
                );
            }

            const user = await userModel.findOne({ email }).select("+password");
            if (!user) {
                return next(new ErrorHandler("Invalid email or password", 400));
            }

            const isPasswordMatch = await user.comparePassword(password);
            if (!isPasswordMatch) {
                return next(new ErrorHandler("Invalid email or password", 400));
            }

            sendToken(user, 200, res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//logout user
export const logoutUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.cookie("access_token", "", { maxAge: 1 });
            res.cookie("refresh_token", "", { maxAge: 1 });

            const userId = req.user?._id || "";
            redis.del(userId);
            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//update access token
export const updateAccessToken = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refresh_token = req.cookies.refresh_token as string;

            const decoded = jwt.verify(
                refresh_token,
                process.env.REFRESH_TOKEN as string
            ) as JwtPayload;
            if (!decoded) {
                return next(
                    new ErrorHandler("Could not get refresh token", 400)
                );
            }

            const session = await redis.get(decoded.id as string);

            if (!session) {
                return next(
                    new ErrorHandler("Please login for access this resource", 400)
                );
            }

            const user = await JSON.parse(session);

            const access_token = jwt.sign(
                { id: user._id },
                process.env.ACCESS_TOKEN as string,
                { expiresIn: "5m" }
            );
            const new_refresh_token = jwt.sign(
                { id: user._id },
                process.env.REFRESH_TOKEN as string,
                { expiresIn: "3d" }
            );

            req.user = user;

            res.cookie("access_token", access_token, accessTokenOptions);
            res.cookie("refresh_token", new_refresh_token, refreshTokenOptions);

            await redis.set(user._id, JSON.stringify(user), "EX", 604800) // 7 day expiry

            res.status(200).json({
                success: true,
                access_token,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//get user info
export const getUserInfo = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?._id;
            getUserById(userId, res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// social auth

interface ISocialAuthBody {
    email: string;
    name: string;
    avatar?: string;
}

export const socialAuth = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, name, avatar } = req.body as ISocialAuthBody;
            const user = await userModel.findOne({ email });
            if (!user) {
                const newUser = await userModel.create({ email, name, avatar });
                sendToken(newUser, 200, res);
            } else {
                sendToken(user, 200, res);
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//update user info
interface IUpdateUserInfo {
    name?: string;
    email?: string;
}

export const updateUserInfo = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email } = req.body as IUpdateUserInfo;
            const userId = req.user?._id;

            const user = await userModel.findById(userId);
            if (email && user) {
                const isEmailExist = await userModel.findOne({ email });
                if (isEmailExist) {
                    return next(new ErrorHandler("Email already exist", 400));
                }
                user.email = email;
            }

            if (name && user) {
                user.name = name;
            }

            await user?.save();

            await redis.set(userId, JSON.stringify(user));

            res.status(201).json({
                success: true,
                user,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update user password
interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}

export const updatePassword = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { oldPassword, newPassword } = req.body as IUpdatePassword;
            const user = await userModel
                .findById(req.user?._id)
                .select("+password");

            if (!oldPassword || !newPassword) {
                return next(
                    new ErrorHandler("Please enter old and new password", 400)
                );
            }

            if (user?.password === undefined) {
                return next(new ErrorHandler("Invalid user", 400));
            }
            const isPasswordMatch = await user?.comparePassword(oldPassword);

            if (!isPasswordMatch) {
                return next(new ErrorHandler("Invalid old password", 400));
            }

            user.password = newPassword;

            await user.save();

            res.status(201).json({
                success: true,
                user,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//update profile avatar

export const updateProfilePicture = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { avatar } = req.body;

            const userId = req.user?._id;

            const user = await userModel.findById(userId);

            if (avatar && user) {
                if (user?.avatar?.public_id) {
                    await cloudinary.v2.uploader.destroy(
                        user?.avatar?.public_id
                    );
                }
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });

                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }

            await user?.save();

            await redis.set(userId, JSON.stringify(user));

            res.status(201).json({
                success: true,
                user,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
//get all users (admin only)
export const getAllUsers = CatchAsyncError(
    (req: Request, res: Response, next: NextFunction) => {
        try {
            getAllUsersService(res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//update user role (admin only)
export const updateUserRole = CatchAsyncError(
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id, role } = req.body;

            updateUserRoleService(res, id, role);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//delete user (admin only)
export const deleteUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const user = await userModel.findById(id);
            if (!user) {
                return next(new ErrorHandler("User not found", 404));
            }

            await user.deleteOne({ id });
            await redis.del(id);

            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
