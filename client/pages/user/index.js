import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import UserRoute from '../../components/routes/UserRoute';
import { Avatar } from 'antd';
import Link from 'next/link'
import { SyncOutlined, PlayCircleOutlined } from '@ant-design/icons'

import {context} from '../../context'

const index = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
    
    const {state: { user}} = useContext(context)

    useEffect(() => {
       loadCourses()
    }, [])

    const loadCourses = async () => {
      try {
        setLoading(true)
        const {data} = await axios.get('/api/user-courses')
      setCourses(data)
      setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

      
  return <UserRoute>
    {loading && <SyncOutlined spin className='d-flex justify-content-center display-1 text-danger p-5' />}
      <h2 className='jumbotron'>User Dashboard</h2>
     
      {courses && courses.map(course => (
        <div key={course._id} className='media pt-2 pb-1'>
          <Avatar size={80} shape='square' src={course.image ? course.image.Location : '/course.png'} />

          <div className='media-body pl-2'>
            <div className='row'>
              <div className='col'>
                <Link href={`/user/course/${course.slug}`} className="pointer">
                  <a className='mt-2 text-primary'><h5>{course.name}</h5></a>
                </Link>
                <p>{course.lessons.length} Lessons</p>
                <p className='text-muted' style={{marginTop: '-15px', fontSize: '12px'}}>
                  By {course.instructor.name}
                </p>
              </div>
              <div className='col-md-3 mt-3 text-center'>
              <Link href={`/user/course/${course.lug}`} className="pointer">
                  <a className='mt-2 text-primary'><PlayCircleOutlined className='h2 text-primary' /></a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

  </UserRoute>
};

export default index;
