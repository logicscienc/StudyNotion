import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from "../../../common/IconBtn"

const RenderTotalAmount = () => {
    const {total} = useSelector((state) => state.cart);

    const handleBuyCourse = () => {
      const courses = cart.map((course) => course._id);
      console.log("Bought these course:", courses);

      // TODO API integrate payment gateway

    }
  return (
    <div>
        <p>Total</p>
        <p>Rs {total}</p>

        <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses={"w-full justify-center"}/>

      
    </div>
  )
}

export default RenderTotalAmount
