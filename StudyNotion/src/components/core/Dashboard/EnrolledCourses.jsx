import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const [EnrolledCourses, setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch (error) {
      console.log("Unable to Fetch Enrolled Courses");
    }
  };
  useEffect(() => {
    getEnrolledCourses();
  }, []);
  return (
    <div>
      <div>Enrolled Courses</div>
      {!EnrolledCourses ? (
        <div>Loading....</div>
      ) : !EnrolledCourses.length ? (
        <p>You have not enrolled in any course yet</p>
      ) : (
        <div>
          <div>
            <img src={configureStore.thumbnail} />
            <div>
              <p>{configureStore.courseName}</p>
              <p>{course.courseDescription}</p>
            </div>
          </div>

          <div>{cousre?.totalDuration}</div>

          <div>
            <p>Progress: {course.progressPercentage || 0}</p>
            <ProgressBar
            completed={course.progressPercentage || 0}
            height="8px"
            isLabelVisible={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
