import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from 'axios';
import { Avatar, Tooltip, Button, Modal } from 'antd'
import { EditOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import AddLessionForm from '../../../../components/forms/AddLessionForm';


const CourseView = () => {
    const [course, setCourse] = useState({})
    const [visible, setVisible] = useState(false)
    const router = useRouter()

    const [uploading, setUploading] = useState(false)
    const [values, setValues] = useState({
        title: '',
        content: '',
        video: ''
    })

    const { slug } = router.query
    // console.log(slug)
    useEffect(() => {
        loadCourse()
    }, [slug])
    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`)
        setCourse(data)
    }

    //function for adding lession
    const handleAddLesson = e => {
        e.preventDefault()
        console.log(values)
    }
  return <InstructorRoute>
      <div className='container-fluid pt-3'>
          {course && <div className='container-fluid pt-1'>
              <Avatar size={80} src={course.image ? course.image.Location : '/course.png'} />
              <div className='media-body pl-2'>
                  <div className='row'>
                      <div className='col'>
                          <h5 className='mt-2 text-primary'>{course.name}</h5>
                          <p style={{marginTop: '-10px'}}>{course.lessons && course.lessons.length} Lessons</p>
                          <p style={{marginTop: '-15px', fontSize: '10px'}}>{course.category}</p>
                      </div>
                  </div>

                  <div className='d-flex'>
                    <Tooltip title="Edit">
                        <EditOutlined className='h5 text-warning mr-4 pointer' />
                    </Tooltip>
                    <Tooltip title="Publish">
                        <CheckOutlined className='h5 pointer text-danger' />
                    </Tooltip>
              </div>

              <div className='row'>
                  <div className='col'>
                     <ReactMarkdown>{course.description}</ReactMarkdown>
                  </div>
              </div>
                <div className='row'>
                    <Button onClick={() => setVisible(true)}
                        className='col-md-6 offset-md-3 text-center'
                        type='primary'
                        shape='round'
                        icon={<UploadOutlined />}
                        size='large'
                    >
                           Add Lesson 
                    </Button>
                </div>
                <br />
                <Modal title="+ Add Lesson" created
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                >
                    <AddLessionForm loading={uploading} values={values} setValues={setValues} handleAddLesson={handleAddLesson} />
                </Modal>
              </div>
              
              </div>}
      </div>
  </InstructorRoute>;
};

export default CourseView;
