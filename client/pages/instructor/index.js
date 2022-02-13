/** @format */

import React, { useState, useEffect } from 'react';
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from 'axios';
import { Avatar, Tooltip } from 'antd';
import Link from 'next/link';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const index = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get('/api/instructor-courses');
    setCourses(data);
  };

  const myStyle = {
    marginTop: '-15px',
    fontSize: '10px',
  };
  return (
    <InstructorRoute>
      <h2 className='bg-light p-5 rounded-lg '>Instructor Dashboard</h2>
      {/* {console.log(courses)} */}
      {courses &&
        courses.map((course) => (
          <>
            <div className='media pt-2'>
              <Avatar
                size={80}
                src={course.image ? course.image.Location : '/imgs/course.jpg'}
              />
              <div className='media-body pl-2'>
                <div className='row'>
                  <div className='col'>
                    <Link
                      href={`/instructor/course/view/${course.slug}`}
                      className='pointer'>
                      <a className='mt-2 text-primary'>
                        <h5>{course.name}</h5>
                      </a>
                    </Link>
                    <p style={{ marginTop: '-10px' }}>
                      {course.lessons.length}
                    </p>
                    {course.lessons.length < 5 ? (
                      <p style={myStyle} className='text-warning'>
                        At least 5 lessons required to publish a course
                      </p>
                    ) : course.published ? (
                      <p style={myStyle} className='text-success'>
                        This is is live
                      </p>
                    ) : (
                      <p style={myStyle} className='text-success'>
                        Your course is ready to be published
                      </p>
                    )}
                  </div>
                  <div className='col-md-3 mt-3 text-center'>
                    {course.published ? (
                      <Tooltip title='Published'>
                        <CheckCircleOutlined className='h5 pointer text-success' />
                      </Tooltip>
                    ) : (
                      <Tooltip title='Unpublished'>
                        <CloseCircleOutlined className='h5 pointer text-warning' />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
    </InstructorRoute>
  );
};

export default index;
