import React from 'react'
import IconBtn from './IconBtn'

const ConfirmationModal = () => {
  return (
    <div>
        <div>
            <p>
                {modalData.text1}
            </p>
            <p>
                {modalData.text2}
            </p>
            <div>
                <IconBtn
                onClick={modalData?.btnHandler}
                text={modalData?.btn1Text}/>
                <button onClick={modalData?.btn2Handler}>
                    {modaldata?.btn2Text}
                </button>
            </div>
        </div>
      
    </div>
  )
}

export default ConfirmationModal
