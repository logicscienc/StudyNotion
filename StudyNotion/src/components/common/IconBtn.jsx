import React from 'react'

const IconBtn = ({text, onClick, children, disabled, outline= false, customClasses, type,}) => {
  return (
    <button
    disabled={disabled}
    onClickk={onclick}
    type={type}
    >
        {
            children ? (
                <>
                <span>
                    {text}
                </span>
                {children}
                </>
            ) : (text)
        }

    </button>
  )
}

export default IconBtn
