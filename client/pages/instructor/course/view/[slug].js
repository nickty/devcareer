import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from 'axios';
import { Avatar, Tooltip } from 'antd'
import { EditOutlined, CheckOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'


const CourseView = () => {
    const [course, setCourse] = useState({})
    const router = useRouter()

    const { slug } = router.query
    // console.log(slug)
    useEffect(() => {
        loadCourse()
    }, [slug])
    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`)
        setCourse(data)
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

              </div>
              
              </div>}
      </div>
  </InstructorRoute>;
};

export default CourseView;