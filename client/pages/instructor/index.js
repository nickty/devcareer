import React, { useState, useEffect } from 'react';
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from "axios";

const index = () => {

  const [courses, setCourses] = useState([])

  useEffect(() => {
    loadCourses()
  }, [])  

  const loadCourses = async () => {
    const { data } = await axios.get('/api/instructor-courses')
    setCourses(data)
  }
  return <InstructorRoute>
      <h2 className='jumbotron'>Instructor Dashboard</h2>
      
  </InstructorRoute>;
};

export default index;
