"use client";
import AdminSidebar from '@/app/components/Admin/siderbar/AdminSidebar'
import Heading from '../../../app/utils/Heading'
import React from 'react'
import DashboardHeader from '@/app/components/Admin/siderbar/DashboardHeader'
import CreateCourse from '@/app/components/Admin/Course/CreateCourse'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
        <Heading
            title='Learning Hub - Admin'
            description="Learning hub is educational platform"
            keywords="Programming, Technology"
        />
        <div className='flex'>
            <div className='1400px:w-[16%] w-1/5'>
                <AdminSidebar />
            </div>
            <div className='w-[85%]'>
                <DashboardHeader />
                <CreateCourse />
            </div>
        </div>

    </div>
  )
}

export default page