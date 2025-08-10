import React from 'react';
import {Link} from "react-router-dom";


// As you can notice in our Home page we have this kind of button almost 3 4 times that is why we are creating a separate component. we will pass three things as props childern, active and linkto. here children will be the text we want to show in the button, active will be the color of the buttons and linkto will be the link we want to redirect to when the button is clicked. 

const Button = ({children, active, linkto}) => {
  return (
    <Link to={linkto}>
        <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold ${active ? "bg-yellow-50 text-black": "bg-richblack-800"} hover:scale-95 transition-all duration-200`}>
            {children}
        </div>
    </Link>
  )
}

export default Button
