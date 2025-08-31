import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const  Quote = () => {
  return (
    <div>
      We are passinate about revolutionizing the way way we learn. Our innovative platform
      <HighlightText text={"combines technology"} />
      <span className='text-brown-500'>
        {" "}
          expertise 
      </span>
       , and community to create an
    
      <span className='text-brown-500'>
        {" "}
        unparalleled educational experience.  
      </span>
      

    </div>
  )
}

export default  Quote
 