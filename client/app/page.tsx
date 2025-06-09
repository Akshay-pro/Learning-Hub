"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
import Courses from "./components/Route/Courses";
import FAQ from "./components/Faq/FAQ";
import Footer from "./components/Footer";
interface Props {}

const Page: FC<Props> = (props) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);

    const [route, setRoute] = useState("Sign-Up");

    return (
        <div suppressHydrationWarning>
            <Heading
                title="Learning Hub"
                description="Learning Hub Platform"
                keywords="Programming, Web Dev, App Dev"
            />

            <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route} />
            <Hero />
            <Courses />
            <FAQ />
            <Footer />
        </div>
    );
};

export default Page;
