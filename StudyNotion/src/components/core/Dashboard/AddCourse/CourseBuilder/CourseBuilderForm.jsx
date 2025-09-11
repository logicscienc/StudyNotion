import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import IconBtn from '../../../../common/IconBtn';
import { GrAddCircle } from 'react-icons/gr';
import { useSelector, useDispatch } from 'react-redux';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import { toast } from "react-hot-toast";
import { updateSection, createSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';

const CourseBuilderForm = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const [editSectionName, setEditSectionName] = useState(null);
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    if (editSectionName) {
      // editing an existing section
      result = await updateSection({
        sectionName: data.sectionName,
        sectionId: editSectionName,
        courseId: course._id,
      }, token);
    } else {
      // creating a new section
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course._id,
      }, token);
    }

    // update values
    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    setLoading(false);
  };

  const cancleEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add at least one Section");
      return;
    }

    if (course.courseContent.some((section) => section.subSection.length === 0)) {
      toast.error("Please add at least one lecture in each section");
      return;
    }

    dispatch(setStep(3));
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancleEdit();
      return;
    }

    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className='text-white'>
      <p>Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Section name <sup>*</sup></label>
          <input
            id="sectionName"
            placeholder='Add section name'
            {...register("sectionName", { required: true })}
            className='w-full'
          />
          {errors.sectionName && (
            <span>Section Name is required</span>
          )}
        </div>

        <div>
          <IconBtn
            type="submit"
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
            customClasses={"text-white"}
          >
            <GrAddCircle className='text-white' size={20} />
          </IconBtn>

          {editSectionName && (
            <button
              type="button"
              onClick={cancleEdit}
              className='text-sm text-richblack-300 underline'
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {course.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      <div>
        <button onClick={goBack} className='rounded-md cursor-pointer flex items-center'>
          Back
        </button>
        <IconBtn text="Next" onClick={goToNext}>
          <MdKeyboardArrowRight />
        </IconBtn>
      </div>
    </div>
  );
};

export default CourseBuilderForm;

