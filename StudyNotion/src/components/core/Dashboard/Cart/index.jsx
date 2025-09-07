import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses';
import RenderTotalAmount from './RenderTotalAmount';

const index = () => {
    const {total, totalItems} = useSelector((state)=> state.auth);
  return (
    <div>
      <h1>Your Cart</h1>
      <p>{totalItems} Courses in Cart</p>

      {total > 0
      ? (
        <div>
            <RenderCartCourses/>
            <RenderTotalAmount/>
        </div>
      ) : (
        <p>Your Cart is Empty</p>
      )
      }
    </div>
  )
}

export default index
