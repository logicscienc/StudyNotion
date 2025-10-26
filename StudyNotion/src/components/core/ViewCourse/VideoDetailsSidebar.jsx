import React, {useEffect, useState} from 'react'
import {useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";

const VideoDetailsSidebar = ({set}) => {

    const [activeStatus, setActiveStatus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("");
    const naviagte = useNavigate();
    const location = useLocation();
    const {sectionId, subSectionId} = useParams();

    const {
        courseSectionData,
        courseEntireData,
        totalNoOflectures,
        completedLectures,
    } = useSelector((state) => state.viewCourse);

    useEffect(()=> {
        const setActiveFlags = () => {
            if(!courseSectionData.length)
                return;
            const currentSectionIndex = courseSectionData.findIndex(
                (data) => data._id === sectionId 
            )

            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                (data) => data._id === subSectionId 
            )

            const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;

            // set current section here
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);

            // set current sub-section here
            setVideoBarActive(activeSubSectionId);
        }

     setActiveFlags();
    }, [courseSectionData, courseEntireData, location.pathname])
  return (
    <div>
      
    </div>
  )
}

export default VideoDetailsSidebar
