import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesAPI';
import {fetchCourseDetails} from "../services/operations/courseDetailsAPI";
import { setCourse } from '../slices/courseSlice';
import GetAvgRating from "../utils/avgRating";
import Error from "./Error";
import ConfirmationModal from "../components/common/ConfirmationModal"
import RatingStars from "../components/common/RatingStars"

const CourseDetails = () => {

    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state)=>state.auth);
    const {loading} = useSelector((state) => state.profile);
    const {paymentloading} = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {courseId}  = useParams();

    const [courseData, setCourseData] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    useEffect(() => {
        const getCourseFullDetails = async()=> {
            try{
                const result = await fetchCourseDetails(courseId);
                setCourseData(result);
            }
            catch(error){
                console.log("Could not fetch course details");
            }
        }
        getCourseFullDetails();

    }, [courseId]);

    const [avgReviewCount, setAverageReviewCount] = useState(0);
    useEffect(() => {
        if (!courseData?.data?.courseDetails) return;
        const count = GetAvgRating(courseData?.data?.courseDetails.ratingAndReviews);
        setAverageReviewCount(count);
    }, [courseData])

    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(() =>{
        let lectures = 0;
        courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0
        })
        setTotalNoOfLectures(lectures);
    }, [courseData]);


    // TO Update 
    const handleBuyCourse = () => {
        
        if(token) {
            buyCourse(token, [courseId], user, navigate, dispatch);
            return;
        }
        setConfirmationModal({
            text1: "you are not Logged in",
            text2: "Please login to purchase the course",
            btn1Text: "Login",
            btn2Text: "cancel",
            btn1Handler: ()=> navigate("/login"),
            btn2Handler: ()=> setConfirmationModal(null),
        })
    }

    if(loading || !courseData) {
        return (
            <div>
                Loading....
            </div>
        )
    }

    if(!courseData.success) {
        return(
            <div>
                <Error/>
            </div>
        )
    }

    const {
         _id:course_id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createAt,
    } = courseData.data?.courseDetails || {};


  return (
    <div className='flex items-center text-white'>
        <p>{courseName}</p>
        <p>{courseDescription}</p>

        <div>
            <span>{avgReviewCount}</span>
            <RatingStars Review_Count={avgReviewCount} Star_Size={24}/>
            <span>{`(${ratingAndReviews?.length || 0} reviews)`}</span>
            <span>{`(${studentsEnrolled?.length || 0} students enrolled)`}</span>
        </div>
       

       {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  )
}

export default CourseDetails

