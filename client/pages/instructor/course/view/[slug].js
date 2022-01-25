import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from 'axios';


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
          {console.log(course)}
      </div>
  </InstructorRoute>;
};

export default CourseView;
