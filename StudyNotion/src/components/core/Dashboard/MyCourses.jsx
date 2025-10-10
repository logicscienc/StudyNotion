import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchCourseDetails, fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'

const MyCourses = () => {

    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async() => {
            const result = await fetchInstructorCourses(token);

            if(result) {
                setCourses(result);
            }
        }
        fetchCourses();
    })
  return (
    <div>
      
    </div>
  )
}

export default MyCourses
