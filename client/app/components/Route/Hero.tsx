import Image from "next/image";
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";
import Link from "next/link";
type Props = {};

const Hero: FC<Props> = (props) => {
    return (
        <div className="w-full 1000px:flex items-center">
            <div className="absolute top-[100px] 1000px:top-[unset] 1400px:h-[600px] 1400px:w-[600px] h-[50vh] w-[50vh] hero_animation rounded-[50%] ">
                {" "}
            </div>
            <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10">
                <Image
                    src="/assets/banner-img-1.png"
                    alt="image"
                    className="object-contain 1100px:max-w-[90%] w-[90%] 1400px:max-w-[85%] h-[auto] z-[10]"
                    width={500}
                    height={500}
                />
            </div>
            <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[60px]">
                <h2 className="dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[60px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1000px:!w-[78%]">
                    Improve Your Online Learning Experience Better Instantly
                </h2>
                <br />
                <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1000px:!w-[78%]">
                    We have 40k+ Online course & 500k+ online registered
                    student. Find your desired courses from them
                </p>
                <br />
                <br />
                <div className="1000px:w-[78%] w-[90%] h-[50px] bg-transparent relative">
                    <input
                        type="search"
                        placeholder="Search Courses..."
                        className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-nonetext-[#ffffffe6] text-[20px] font-[500] font-Josefin"
                    />
                    <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
                        <BiSearch className="text-white" size={30} />
                    </div>
                </div>
                <br /> <br />
                <div className="1000px:w-[78%] w-[90%] flex items-center">
                    <Image
                        src="/assets/client-1.jpg"
                        alt="logo-1"
                        className="rounded-full"
                        width={40}
                        height={40}
                    />
                    <Image
                        src="/assets/client-2.jpg"
                        alt="logo-2"
                        className="rounded-full ml-[-20px]"
                        width={40}
                        height={40}
                    />
                    <Image
                        src="/assets/client-3.jpg"
                        alt="logo-3"
                        className="rounded-full ml-[-20px]"
                        width={40}
                        height={40}
                    />

                    <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600]">
                        500k+ People Already Trusted Us{" "}
                        <Link
                            href="/course"
                            className="dark:text-[#46e256] text-[crimson]"
                        >
                            View Courses
                        </Link>{" "}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Hero;
