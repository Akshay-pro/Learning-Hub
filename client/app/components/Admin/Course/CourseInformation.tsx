import { styles } from "@/app/styles/style";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";

type Props = {
    courseInfo: any;
    setCourseInfo: (courseInfo: any) => void;
    active: number;
    setActive: (active: number) => void;
};

const CourseInformation: FC<Props> = ({
    courseInfo,
    setCourseInfo,
    active,
    setActive,
}) => {
    const [dragging, setDragging] = useState(false);

    const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
            refetchOnMountOrArgChange: true,
        });

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if(data?.layout?.categories){
            setCategories(data?.layout?.categories);
        }
    }, [data]);
    console.log(data);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setActive(active + 1);
    };
    const handleFileChange = (e: any) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (reader.readyState === 2) {
                    setCourseInfo({ ...courseInfo, thumbnail: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(false);

        const file = e.dataTransfer.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                setCourseInfo({ ...courseInfo, thumbnail: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-[80%] m-auto mt-24">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className={`${styles.label}`}>
                        Course Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={courseInfo.name}
                        onChange={(e: any) =>
                            setCourseInfo({
                                ...courseInfo,
                                name: e.target.value,
                            })
                        }
                        id="name"
                        placeholder="Mern Stack Course.."
                        className={`${styles.input}`}
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="description" className={`${styles.label}`}>
                        Course Descriptiom
                    </label>
                    <textarea
                        name="description"
                        required
                        value={courseInfo.description}
                        onChange={(e: any) =>
                            setCourseInfo({
                                ...courseInfo,
                                description: e.target.value,
                            })
                        }
                        rows={5}
                        cols={30}
                        id="description"
                        placeholder="Write something about course..."
                        className={`${styles.input} !h-min !py-2`}
                    ></textarea>
                </div>
                <br />

                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label htmlFor="price">Course Price</label>
                        <input
                            type="number"
                            name="price"
                            required
                            value={courseInfo.price}
                            onChange={(e: any) =>
                                setCourseInfo({
                                    ...courseInfo,
                                    price: e.target.value,
                                })
                            }
                            id="price"
                            placeholder="300"
                            className={`${styles.input}`}
                        />
                    </div>
                    <br />
                    <div className="w-[45%]">
                        <label htmlFor="estimatedPrice">
                            Estimated Price (Optional)
                        </label>
                        <input
                            type="number"
                            name="estimatedPrice"
                            required
                            value={courseInfo.estimatedPrice}
                            onChange={(e: any) =>
                                setCourseInfo({
                                    ...courseInfo,
                                    estimatedPrice: e.target.value,
                                })
                            }
                            id="estimatedPrice"
                            placeholder="300"
                            className={`${styles.input}`}
                        />
                    </div>
                </div>
                <br />

                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label
                            htmlFor="courseTags"
                            className={`${styles.label}`}
                        >
                            Course Tags
                        </label>
                        <input
                            type="text"
                            name="tags"
                            required
                            value={courseInfo.tags}
                            onChange={(e: any) =>
                                setCourseInfo({
                                    ...courseInfo,
                                    tags: e.target.value,
                                })
                            }
                            id="courseTags"
                            placeholder="Javascript, Java..."
                            className={`${styles.input} !h-min !py-2`}
                        />
                    </div>
                    <div className="w-[45%]">
                        <label htmlFor="" className={`${styles.label}`}>
                            Course Categories
                        </label>
                        <select
                            name=""
                            id=""
                            className={`${styles.input}`}
                            value={courseInfo.categories}
                            onChange={(e: any) => {
                                setCourseInfo({
                                    ...courseInfo,
                                    categories: e.target.value,
                                });
                            }}
                        >
                            <option value="" className="dark:bg-[#111C43]">
                                Select Category
                            </option>
                            {categories.map((item: any) => (
                                <option
                                    value={item._id}
                                    key={item._id}
                                    className="dark:bg-[#111C43]"
                                >
                                    {item.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <br />

                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label
                            htmlFor="courseLevel"
                            className={`${styles.label}`}
                        >
                            Course Level
                        </label>
                        <input
                            type="text"
                            name="level"
                            required
                            value={courseInfo.level}
                            onChange={(e: any) =>
                                setCourseInfo({
                                    ...courseInfo,
                                    level: e.target.value,
                                })
                            }
                            id="courseLevel"
                            placeholder="Intermediate..."
                            className={`${styles.input} !h-min !py-2`}
                        />
                    </div>
                    <div className="w-[45%]">
                        <label htmlFor="demoUrl" className={`${styles.label}`}>
                            Demo Url
                        </label>
                        <input
                            type="text"
                            name="demoUrl"
                            required
                            value={courseInfo.demoUrl}
                            onChange={(e: any) =>
                                setCourseInfo({
                                    ...courseInfo,
                                    demoUrl: e.target.value,
                                })
                            }
                            id="demoUrl"
                            placeholder="Give demo url..."
                            className={`${styles.input} !h-min !py-2`}
                        />
                    </div>
                </div>
                <br />

                <div className="w-full">
                    <input
                        type="file"
                        accept="image/*"
                        id="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="file"
                        className={`w-full min-h-[10vh] border dark:border-white border-[#00000026] p-3 flex items-center justify-center ${
                            dragging ? "bg-blue-500" : "bg-transparent"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {courseInfo?.thumbnail ? (
                            <img
                                src={courseInfo.thumbnail}
                                alt=""
                                className="max-h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-black dark:text-white">
                                Drag and Drop here or click to browse
                            </span>
                        )}
                    </label>
                </div>

                <div className="w-full flex items-cenyer justify-end  mb-5">
                    <input
                        type="submit"
                        value="Next"
                        className="w-full 800:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
                    />
                </div>
                <br />
                <br />
            </form>
        </div>
    );
};

export default CourseInformation;
