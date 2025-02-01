import AllCourses from "../../components/Admin/Course/AllCourses";
import AdminSidebar from "@/app/components/Admin/siderbar/AdminSidebar";
import DashboardHero from "@/app/components/Admin/siderbar/DashboardHero";
import Heading from "@/app/utils/Heading";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Heading
        title="Learning Hub - Admin"
        description="Learning Hub is a platform for students to learn and get help from teachers"
        keywords="Programming, MERN, Redux, Machine Learning"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHero />
          <AllCourses />
        </div>
      </div>
    </div>
  );
};

export default page;