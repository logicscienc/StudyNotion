import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm';
import CourseInformationForm from './CourseInformation/CourseInformationForm'; // ✅ Correct import

const RenderSteps = () => {
  const { step } = useSelector((state) => state.course);

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ];

  return (
    <>
      <div className="flex gap-4">
        {steps.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                step === item.id
                  ? "bg-yellow-900 border-yellow-50 text-yellow-50"
                  : "border-richblack-700 bg-richblack-800 text-richblack-300"
              }`}
            >
              {step > item.id ? <FaCheck /> : item.id}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-2">
        {steps.map((item) => (
          <p key={item.id} className="text-sm text-gray-300">
            {item.title}
          </p>
        ))}
      </div>

      <div className="mt-6">
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {/* {step === 3 && <PublishCourse />} */}
      </div>
    </>
  );
};

export default RenderSteps;


