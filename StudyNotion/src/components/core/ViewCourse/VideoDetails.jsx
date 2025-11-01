import React, {useRef, useState} from 'react'
import { useLocation } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom"
import {markLectureAsComplete} from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import IconBtn from "../../common/IconBtn"
import { Player } from 'video-react';
import { CiPlay1 } from "react-icons/ci";
import '~video-react/dist/video-react.css';

const VideoDetails = () => {

  const {courseId, sectionId, subSectionId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef();
  const location = useLocation();
  const {token} = useSelector((state) => state.auth);
  const {courseSectionData, courseEntireData, completedLectures} = useSelector((state)=>state.viewCourse);
  const [videoData, setVideoData] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    const setVideoSpecificDetails = async() => {
      if(!courseSectionData.length)
        return;
      if(!courseId && !sectionId) {
        navigate("/dashboard/enrolled-courses");
      }
      else{
        // let's assume k all 3 fields are present

        const filteredData = courseSectionData.filter(
          (course)=> course._id === sectionId
        )

        const filteredVideoData = filteredData?.[0].subsection.filter(
          (data) => data._id === subSectionId
        )

        setVideoData(filteredVideoData[0]);
        setVideoEnded(false);
      }
    }

    setVideoSpecificDetails();
  },[courseSectionData, courseEntireData, location.pathname])

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionindex = courseSectionData[currentSectionIndex].subsectionId.findIndex(
      (data) => data._id === subSectionId
    )
    if(currentSectionIndex === 0 && currentSubSectionindex === 0) {
      return true;
    }
    else{
      return false;
    }

  }

  const isLastVideo = () => {
     const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
     const noOfSubSections = courseSectionData[currentSectionIndex].subsection.length;

    const currentSubSectionindex = courseSectionData[currentSectionIndex].subsectionId.findIndex(
      (data) => data._id === subSectionId
    )

    if(currentSectionIndex === courseSectionData.length -1 && currentSubSectionindex === noOfSubSections -1) {
      return true;
    }
    else{
      return false;
    }
    

  }

  const goToNextVideo = () => {
      const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
     const noOfSubSections = courseSectionData[currentSectionIndex].subsection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subsectionId.findIndex(
      (data) => data._id === subSectionId
    )

    if(currentSectionIndex !== noOfSubSections -1) {
      // same section ki next video me jao
      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSectionIndex + 1]._id;

      // next video pr jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    }

    else {
      // different section ki first video
      const nextSectionId = courseSectionData[currentSectionIndex + 1];
      const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;

      // iss video per jao
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
    }

  }

  const goToPrevVideo = () => {
      const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
     const noOfSubSections = courseSectionData[currentSectionIndex].subsection.length;

    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subsectionId.findIndex(
      (data) => data._id === subSectionId
    )
    
    if(currentSubSectionIndex != 0) {
      // same section, prev video
      const prevSubSectionId = courseSectionData[currentSectionIndex].subsection[currentSubSectionIndex - 1];

      // iss video par chale jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
    }

    else {
      // different section , last video
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;
      const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subsection[prevSubSectionLength - 1]._id;

      // iss video par chale jao
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
    }

  }

  const handleLectureCompletion = async() => {

    // dummy code, baad me we will replace it with the actual acll
    setLoading(true);

    const res = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}, token);

    // state update
    if(res) {
      dispatch(updateCompletedLectures(subSectionId));
    }

    setLoading(false);
    
  }
  return (
    <div>
      {
        !videoData ? (<div>
          No Data Found 
        </div>

        ) : (
          <Player
          ref = {playerRef}
          aspectRatio='16:9'
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
          
          >

            <CiPlay1/>

            {
              videoEnded && (
                <div>
                  {
                    !completedLectures.includes(subSectionId) && (
                      <IconBtn
                      disabled={loading}
                      onclick={()=> handleLectureCompletion()}
                      text={!loading ? "Mark As Completed" : "Loading..."}
                      
                      />
                    )
                  }

                  <IconBtn
                  disabled={loading}
                  onclick={()=> {
                    if(playerRef?.current){
                      playerRef.current?.seek(0);
                      setVideoEnded(false);
                    }
                  }}

                  text="Rewatch"
                  customClasses="text-xl"
                  
                  />

                  <div>
                    {!isFirstVideo() && (
                      <button
                      disabled={loading}
                      onClick={goToPrevVideo}
                      className='blackButton'
                      >
                        Prev
                      </button>
                    )}
                    {!isLastVideo() && (
                      <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      className='blackButton'
                      
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )
            }

          </Player>
        )
      }

      <h1>
        {videoData?.title}
      </h1>
      <p>
        {videoData?.description}
      </p>
    </div>
  )
}

export default VideoDetails
