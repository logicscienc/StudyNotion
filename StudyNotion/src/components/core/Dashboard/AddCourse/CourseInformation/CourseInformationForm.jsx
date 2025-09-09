import React, { useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import {useForm} from "react-hook-form";
import { useDispatch } from 'react-redux';
import { fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
import { HiOutlineCurrencyRupee } from 'react-icons/hi'

const CourseInformationForm = () => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
    } = useForm();

    const dispatch = useDispatch();
    const {course, editCourse} = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);

    useEffect(() => {
        const getCategories = async() => {
            setLoading(true);
            const categories = await fetchCourseCategories();
            if(categories.length > 0){
                setCourseCategories(categories);
            }
            setLoading(false);
        }

        if(editCourse) {
            setValue("courseTitle", course.courseName);
             setValue("courseShortDesc", course.courseDescription);
              setValue("coursePrice", course.Price);
               setValue("courseTags", course.tag);
                setValue("courseBenefits", course.whatYouWillLearn);
                setValue("courseCategory", course.category);
                setValue("courserequirements", course.instructions);
                setValue("courseImage", course.thumbnail);

        }
        getCategories();
    },[])

    const onSubmit = async(date) => {

    }
  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
    className='rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-8'
    >
        <div>
            <label htmlFor='courseTitle'>Course Title<sup>*</sup></label>
            <input
            id="courseTitle"
            placeholder="Enetr Course Title"
            {...register("courseTitle", {required:true})}
            />
            {
                errors.courseTitle && (
                    <span>Course Title is Required<sup>**</sup></span>
                )
            }
        </div>
        <div>
            <label htmlFor='courseShortDesc'>Course Short Description<sup>*</sup></label>
            <textarea
            id="courseShortDesc"
            placeholder="Enter Description"
            {...register("courseShortDesc", {required:true})}
            className='min-h-[140px] w-full'
            />
            {
                errors.courseShortDesc && (
                    <span>Course Description is required**</span>
                )
            }
        </div>

         <div className='relative'>
            <label htmlFor='CoursePrice'>Course Price<sup>*</sup></label>
            <input
            id="coursePrice"
            placeholder="Enetr Course Price"
            {...register("coursePrice", {required:true, valueAsNumber:true})}
            className='w-full'
            />
            <HiOutlineCurrencyRupee className='absolute top-1/2 text-richblack-400'/>
            {
                errors.courseTitle && (
                    <span>Course Price is Required<sup>**</sup></span>
                )
            }
        </div>
        <div>
            <label htmlFor='courseCategory'>Course Category<sup>*</sup></label>
            <select
            id="courseCategory"
            defaultValue=""
            {...register("courseCategory", {required:true})}>
                <option value="disable">Choose a Category</option>
                {
                    !loading && courseCategories.map((category,index) => (
                        <option key={index} value={category?._id}>{category?.name}</option>
                    ))
                }
            </select>
            {errors.courseCategory && (
                <span>
                    Course Category is Required
                </span>
            )}
        </div>

        {/* create a custom component for handling tags input */}
        {/* <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter tags and press enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
        /> */}

        {/* create a component for uploading and showing preview of media */}

        {/* <Upload
        name=
        label=
        register={}
        errors=
        setValue={}
        /> */}

        {/* Benefits of Courses */}
        <div>
            <label>Benefits of the course<sup>*</sup></label>
            <textarea
            />
        </div>


    </form>
  )
}

export default CourseInformationForm
