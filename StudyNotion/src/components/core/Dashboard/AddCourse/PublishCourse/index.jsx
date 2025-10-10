import React, {useState, useSelector, useEffect} from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import IconBtn from '../../../../common/IconBtn'
import { COURSE_STATUS } from '../../../../../utils/constants'
import { resetCourseState } from '../../../../../slices/courseSlice'
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI'
import { setStep } from '../../../../../slices/courseSlice'

const PublishCourse = () => {

  const {register, handleSubmit, setValue, getValues} = useForm();
  const {course} = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, []);

  const goBack = () => {
    dispatch(setStep(2));

  }
  const goToCourses = () => {
    dispatch(resetCourseState());
    // navigate("/dashboard/by-courses");
  }

  const handleCoursePublish = async() => {
    if(course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true || (course.status === COURSE_STATUS.DRAFT && getValues("public") === false)) {
      // no updation in form
      // no need to make api call
      goToCourses();
      return;
    }

    // if form is updated
    const formdata = new FormData();
    formdata.append("courseId", course._id);
    const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;

    setLoading(true);
    const result = await editCourseDetails(FormData, token);
  }

  const onSubmit = () => {
    handleCoursePublish();

  }
  return (
    <div className='rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-700'>
      <p>Publish Course</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Make this Course as Public

             <input
          type="checkbox"
          id='public'
          {...register("public")}
          className='rounded h-4 w-4'
          
          />

          <span className='ml-3'>
            Make this Course as Public
          </span>
       
          </label>
           </div>

           <div>
            <button 
            disabled={loading}
            type='button'
            onClick={goBack}
            className='flex items-center rounded-md bg-richblack-300 p-6'

            >
              Back

            </button>

            <IconBtn disabled={loading} text="save changes"/>
           </div>
         
      </form>
      
    </div>
  )
}

export default PublishCourse
