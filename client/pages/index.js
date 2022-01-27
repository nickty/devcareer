import React, {useState, useEffect} from 'react'
import axios from 'axios'
import CourseCard from '../components/cards/CourseCard'

const index = () => {
    const [courses, setCourses] = useState([])

    useEffect(() => {
        const fetchCoueses = async () => {
            const { data } = await axios.get('/api/courses')
            setCourses(data)
        }
        fetchCoueses()
    }, [])
    return (
        <>
        <div className="squre text-center">
        <h1 className="squre">Bismillah</h1>
        <div className='container-fluid'>
            <div className='row'>
                {courses.map(course => <div key={course._id} className='col-md-4'>
                    <CourseCard course={course} />
                </div>)}
            </div>
        </div>
        </div>
        
        </>
    )
}

export default index