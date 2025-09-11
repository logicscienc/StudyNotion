import React, {useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import { IoMdArrowDropdown } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdAdd } from 'react-icons/md'
import SubSectionModal from './SubSectionModal'
import { deleteSubSection } from '../../../../../services/operations/courseDetailsAPI'


const NestedView = ({handleChangeEditSectionName}) => {

    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [addSubSection, setAddSubSection] = useState(null);
    const[viewSubSection, setViewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);

    const [confirmationModal, setConfirmationModal] = useState(null);

    const handleDeleteSection = async (sectionId) => {
        const result = await deleteSection({
            sectionId,
            courseId: course._id,
            token,
        })

        if(result) {
            dispatch(setCourse(result))
        }
        setConfirmationModal(null);

    }

    const handleDeleteSubSection =async (subSectionId, sectionId) => {
        const result = await deleteSubSection({subSectionId, sectionId, token});
        if(result){
            dispatch(setCourse(result));
        }
        setConfirmationModal(null);

    }
  return (
    <div>
        <div>
            {course?.courseContent?.map((section) => (
                <details key={section._id} open>
                <summary className='flex items-center justify-between gap-x-3 border-b-2'>
                    <div>
                        <IoMdArrowDropdown/>
                        <p>{section.sectionName}</p>
                    </div>
                    <div className='flex items-center gap-x-3'>
                        <button
                        onClick={handleChangeEditSectionName(section._id, section.sectionName)}
                        >
                            <MdEdit/>
                        </button>

                        <button
                        onClick={() => {
                            setConfirmationModal({
                                text1: "Delete this section",
                                text2: "All the lecture in this section will be deleted",
                                btn1Text: "Delete",
                                btn2Text: "Cancel",
                                btn1Handler: () => handleDeleteSection(section._id),
                                btn2Handler: () => setConfirmationModal(null),
                            })
                        }}
                        >
                            <RiDeleteBinLine/>

                        </button>
                        <span>|</span>
                        <IoMdArrowDropdown className={`text-xl text-richblack-300`}/>
                    </div>
                </summary>

                <div>
                    {
                        section.subSection.map((data) => {
                            <div 
                            key={data?.id}
                            onClick={() => setViewSubSection(data)}
                            className='flex items-center justify-between gap-x-3 border-b-2'
                            >
                                <div className='flex items-center gap-x-3'>
                                    <IoMdArrowDropdown/>
                                    <p>{data.title}</p>
                                </div>

                                <div
                                className='flex items-center gap-x-3'
                                >

                                    <button
                                    onClick={(setEditSubSection({...data, sectionid:section._id}))}
                                    >
                                        <MdEdit/>

                                    </button>
                                    <button
                                    onClick={() => setConfirmationModal({
                                         text1: "Delete this Sub Section",
                                text2: "Selected Lecture will be deleted",
                                btn1Text: "Delete",
                                btn2Text: "Cancel",
                                btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                                btn2Handler: () => setConfirmationModal(null),

                                    })}
                                    >
                                        <RiDeleteBinLine/>

                                    </button>

                                    </div>
                            </div>
                        })
                    }

                    <button
                    onClick={setAddSubSection(section._id)}
                    className='mt-4 flex items-center gap-x-2 text-yellow-50'
                    >
                        <MdAdd/>
                        <p>Add Lecture</p>
                    </button>
                </div>
                </details>
            ))}
        </div>

        {addSubSection ? 
        (
            <SubSectionModal 
            modalData={addSubSection}
            setModalData={setAddSubSection}
            add={true}
            />
        )
        : viewSubSection ? 
        (<SubSectionModal
        modalData={viewSubSection}
        setModalData={setViewSubSection}
        view={true}
        />

        ) : editSubSection ? 
        (
            <SubSectionModal
            modalData={editSubsection}
            setModalData={setEditSubSection}
            edit={true}
            />
        ): (
            <div></div>
        )
    }

    {confirmationModal ?
    (
        <confirmationModal modalData={confirmationModal}/>
    ) : (<div></div>)
    }
      
    </div>
  )
}

export default NestedView
