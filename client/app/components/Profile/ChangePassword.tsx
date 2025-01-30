"use client";
import { styles } from "@/app/styles/style";
import { useUpdateUserPasswordMutation } from "@/redux/features/user/userApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword = (props: Props) => {
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const [updatePassword, { isSuccess, error }] =
        useUpdateUserPasswordMutation();

    const changePasswordHandler = async (e: any) => {
        e.preventDefault();
        if (
            oldPassword === "" ||
            newPassword === "" ||
            confirmPassword === ""
        ) {
            toast.error("Please fill all fields");
        }

        if (newPassword !== confirmPassword) {
            toast.error("New and confirm password do not match");
        } else {
            await updatePassword({ oldPassword, newPassword });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Password updated successfully");
        }

        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error]);
    return (
        <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
            <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-2">
                Change Password
            </h1>
            <div className="w-full">
                <form
                    onSubmit={changePasswordHandler}
                    className="flex flex-col items-center"
                >
                    <div className="w-[100%] 800px:w-[60%] mt-5">
                        <label
                            className="block pb-2 text-black dark:text-[#fff]"
                            htmlFor="old-password"
                        >
                            Enter your old password
                        </label>
                        <input
                            type="password"
                            id="old-password"
                            placeholder="Enter old Password"
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`}
                            required
                            value={oldPassword}
                            onChange={(e: any) =>
                                setOldPassword(e.target.value)
                            }
                        />
                    </div>
                    <div className="w-[100%] 800px:w-[60%] mt-2">
                        <label
                            className="block pb-2 text-black dark:text-[#fff]"
                            htmlFor="new-password"
                        >
                            Enter your new password
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            placeholder="Enter new Password"
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`}
                            required
                            value={newPassword}
                            onChange={(e: any) =>
                                setNewPassword(e.target.value)
                            }
                        />
                    </div>
                    <div className="w-[100%] 800px:w-[60%] mt-2">
                        <label
                            className="block pb-2 text-black dark:text-[#fff]"
                            htmlFor="confirm-password"
                        >
                            Confirm your new password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Enter confirm Password"
                            className={`${styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`}
                            required
                            value={confirmPassword}
                            onChange={(e: any) =>
                                setConfirmPassword(e.target.value)
                            }
                        />

                        <input
                            type="submit"
                            value="Update"
                            className={`w-[95%] h-[40px] border border=[#37a39a] text-center text-black dark:text-[#fff] rounded-[3px] mt-8 cursor-pointer`}
                            required
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
