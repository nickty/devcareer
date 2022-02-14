/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/cards/CourseCard';

const index = ({ courses = {} }) => {
  // const [courses, setCourses] = useState([])

  // useEffect(() => {
  //     const fetchCoueses = async () => {
  //         const { data } = await axios.get('/api/courses')
  //         setCourses(data)
  //     }
  //     fetchCoueses()
  // }, [])
  //   console.log(courses);
  return (
    <>
      <div className='text-center'>
        <div className='jumbotron bg-light p-5 rounded-lg'>
          <h1 className='text-white'>Bismillah</h1>
          <p className='lead'>বাংলা ভিডিও কোর্স এবং লাইভ ট্রেনিং প্ল্যাটফর্ম</p>
          <p>The pathway to success as a professional software developer</p>
        </div>

        <div className='container-fluid'>
          <div className='row'>
            {courses.map((course) => (
              <div key={course._id} className='col-md-4'>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses`);
  return {
    props: {
      courses: data,
    },
  };
}

export default index;
