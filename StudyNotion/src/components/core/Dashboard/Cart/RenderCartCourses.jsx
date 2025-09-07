import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactStars from 'react-stars';
import { GiNinjaStar } from "react-icons/gi"
import { RiDeleteBin6Line } from 'react-icons/ri'

const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div>
      {cart.map((course, index) => (
        <div key={index} className="flex justify-between items-center p-4 border-b">
          {/* Left Section */}
          <div className="flex items-start gap-4">
            <img 
              src={course?.thumbnail} 
              alt={course?.courseName} 
              className="w-20 h-20 object-cover rounded" 
            />
            <div>
              <p className="font-semibold text-lg">{course?.courseName}</p>
              <p className="text-gray-600 text-sm">{course?.category?.name}</p>

              <div className="flex items-center gap-2 mt-1">
                <ReactStars
                  count={5}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<GiNinjaStar />}
                  fullIcon={<GiNinjaStar />}
                  value={4.8} 
                />
                <span className="text-gray-500 text-sm">
                  {course?.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Remove Button */}
          <div>
            <button
              className="flex items-center gap-2 text-red-500 hover:text-red-700"
              onClick={() => dispatch(removeFromCart(course._id))}
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>
            <p>Rs {course?.price}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RenderCartCourses

