import React from "react";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/Admin/siderbar/AdminSidebar";
import DashboardHero from "../components/Admin/siderbar/DashboardHero";
type Props = {};

const page = (props: Props) => {
    return (
        <div>
            <Heading
                title="Learning Hub - Admin"
                description="Learning Hub Platform"
                keywords="Programming, Web Dev, App Dev"
            />

            <div className="flex h-[200vh]">
                <div className="1400px:w-[16%] w-1/5">
                    <AdminSidebar />
                </div>

                <div className="w-[85%]">
                    <DashboardHero />
                </div>
            </div>
        </div>
    );
};

export default page;
