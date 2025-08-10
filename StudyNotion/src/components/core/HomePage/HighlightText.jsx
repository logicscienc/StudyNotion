import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className='font-bold bg-gradient-to-b from-blue-50 to-blue-100 bg-clip-text text-transparent'>
        {" "}
        {text}
        {" "}
    </span>
  )
}

export default HighlightText
