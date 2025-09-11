import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const SubSectionModal = ({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false,
}) => {

    const {
        register,
        handleSubmit,
        setvalue,
        formState: {errors},
        getValues,
    } = useForm();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);

    useEffect(() => {
        if(view || edit) {
            setvalue("lectureTitle", modalData.title);
            setvalue("lectureDesc", modalData.description);
            setvalue("lectureVideo", modalData.videoUrl);
        }
    }, []);

    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.lectureTitle !== modalData.title || 
            currentValues.lectureDesc !== modalData.description || 
            currentValues.lectureVideo !== modalData.videoUrl ) {
                return true;
            }

            else{
                return false;
            }
    }

    const onSubmit = () => {
        if(view)
            return;
        if(edit){
            if(!isFormUpdated){
                toast.error("No changes made to the form")

            }
            else{
                // edit krdo store me
                handleEditSubSectionn();
            }
            return;
              }
    }
    }
  return (
    <div>
      
    </div>
  )
}

export default SubSectionModal
