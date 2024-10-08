import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiFillGithub,
} from "react-icons/ai";
import { styles } from "../../styles/style";
import { FcGoogle } from "react-icons/fc";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type Props = {
    setRoute: (route: string) => void;
    setOpen: (open: boolean) => void;
};

const schema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email")
        .required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(6),
});
const Login: FC<Props> = ({ setRoute, setOpen }) => {
    const [show, setShow] = useState(false);
    const [login, {isSuccess, data, error}] = useLoginMutation();
    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            await login({email, password})
        },
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success("Login successfully");
            setOpen(false)
        }

        if (error) {
            if ("data" in error) {
                const errData = error as any;
                toast.error(errData.data.message);

            } else {
                console.log("An error occured", error);
            }
        }
    }, [isSuccess, error]);
    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="w-full">
            <h1 className={`${styles.title}`}>Login with learning hub</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="email" className={`${styles.label}`}>
                    Enter your email
                </label>
                <input
                    type="email"
                    name=""
                    value={values.email}
                    onChange={handleChange}
                    id="email"
                    placeholder="user@gmail.com"
                    className={`${
                        errors.email && touched.email && "border-red-500"
                    } ${styles.input}`}
                />

                {errors.email && touched.email && (
                    <span className="text-red-500 pt-2 block">
                        {errors.email}
                    </span>
                )}
                <div className="w-full mt-5 relative mb-1">
                    <label htmlFor="password" className={`${styles.label}`}>
                        Enter your Password
                    </label>
                    <input
                        type="password"
                        name=""
                        value={values.password}
                        onChange={handleChange}
                        id="password"
                        placeholder="Your Password"
                        className={`${
                            errors.password &&
                            touched.password &&
                            "border-red-500"
                        } ${styles.input}`}
                    />
                    {!show ? (
                        <AiOutlineEyeInvisible
                            className="absolute bottom-3 right-2 z-1 cursor-pointer"
                            size={20}
                            onClick={() => setShow(true)}
                        />
                    ) : (
                        <AiOutlineEye
                            className="absolute bottom-3 right-2 z-1 cursor-pointer"
                            size={20}
                            onClick={() => setShow(false)}
                        />
                    )}
                    {errors.password && touched.password && (
                        <span className="text-red-500 pt-2 block">
                            {errors.password}
                        </span>
                    )}
                </div>
                <div className="w-full mt-5">
                    <input
                        type="submit"
                        value="Login"
                        className={`${styles.button}`}
                    />
                </div>
                <br />
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                    Or Join With
                </h5>
                <div className="flex items-center justify-center my-3">
                    <FcGoogle size={30} className="cursor-pointer ml-2" onClick={() => signIn('google', { callbackUrl: 'http://localhost:3000' })} />
                    <AiFillGithub size={30} className="cursor-pointer ml-2" onClick={() => signIn('github', { callbackUrl: 'http://localhost:3000' })} />
                </div>
                <h5 className="text-center pt-4 font-Poppins text-[14px]">
                    Not have any account -
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer"
                        onClick={() => setRoute("Sign-Up")}
                    >
                        Sign up
                    </span>
                </h5>
            </form>
            <br />
        </div>
    );
};

export default Login;
