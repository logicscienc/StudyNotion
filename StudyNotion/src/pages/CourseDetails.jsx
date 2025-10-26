import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "./Error";
import ConfirmationModal from "../components/common/ConfirmationModal";
import RatingStars from "../components/common/RatingStars";
import { formatDate } from "../services/formatDate";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";

const CourseDetails = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [avgReviewCount, setAverageReviewCount] = useState(0);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [isActive, setIsActive] = useState([]);

  // 🔹 Fetch full course details
  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        console.log("Printing CourseData-> ", result);
        setCourseData(result);
      } catch (error) {
        console.log("Could not fetch course details");
      }
    };
    getCourseFullDetails();
  }, [courseId]);

  // 🔹 Compute average rating
  useEffect(() => {
    const count = GetAvgRating(courseData?.data?.[0]?.ratingAndReviews);
    setAverageReviewCount(count);
  }, [courseData]);

  // 🔹 Compute total lectures
  useEffect(() => {
    let lectures = 0;
    courseData?.data?.[0]?.courseContent?.forEach((sec) => {
      lectures += sec.subSection?.length || 0;
    });
    setTotalNoOfLectures(lectures);
  }, [courseData]);

  // 🔹 Toggle active sections
  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat(id)
        : isActive.filter((e) => e !== id)
    );
  };

  // 🔹 Handle buy course
  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please login to purchase the course",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  // 🔹 Handle loading or missing data
  if (loading || !courseData) {
    return <div>Loading...</div>;
  }

  if (!courseData.success || !courseData?.data?.length) {
    return (
      <div>
        <Error />
      </div>
    );
  }

  // 🔹 Destructure course safely
  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = courseData?.data?.[0] || {};

  console.log("Course Data Structure:", courseData);

  return (
    <div className="flex flex-col text-white">
      <div className="relative flex flex-col justify-start p-8">
        <p className="text-2xl font-bold">{courseName}</p>
        <p className="text-gray-300 mb-2">{courseDescription}</p>

        <div className="flex gap-x-2 items-center">
          <span>{avgReviewCount}</span>
          <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
          <span>{`(${ratingAndReviews?.length || 0} reviews)`}</span>
          <span>{`(${studentsEnrolled?.length || 0} students enrolled)`}</span>
        </div>

        <div className="mt-2">
          <p>Created By {instructor?.firstName || "Unknown"}</p>
        </div>

        <div className="flex gap-x-3 mt-2">
          <p>Created At {formatDate(createdAt)}</p>
          <p>English</p>
        </div>

        <div className="mt-4">
          <CourseDetailsCard
            course={courseData?.data?.[0]}
            setConfirmationModal={setConfirmationModal}
            handleBuyCourse={handleBuyCourse}
          />
        </div>
      </div>

      <div className="p-8">
        <p className="text-xl font-semibold mb-2">What You Will Learn</p>
        <div className="text-gray-300">{whatYouWillLearn}</div>
      </div>

      <div className="p-8">
        <div>
          <p className="text-xl font-semibold">Course Content:</p>
        </div>

        <div className="flex gap-x-3 justify-between mt-2">
          <div className="text-gray-400">
            <span>{courseContent?.length || 0} section(s)</span>
            <span className="mx-2">{totalNoOfLectures} lectures</span>
            <span>{courseData.data?.[0]?.totalDuration || "N/A"} total length</span>
          </div>

          <div>
            <button
              onClick={() => setIsActive([])}
              className="text-blue-400 hover:underline"
            >
              Collapse all Sections
            </button>
          </div>
        </div>
      </div>

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  );
};

export default CourseDetails;

