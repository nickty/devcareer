import React from 'react';
import { useRouter } from 'next/router'
import axios from 'axios'

const SingleCourse = ({course}) => {
    const router = useRouter()
    const { slug } = router.query
  return <>
    <div className='container-fluid'>
        <div className='row'>
            {console.log(course)}
         </div>
    </div>
  </>;
};

export async function getServerSideProps ({query}){
    const { data } = await axios(`${process.env.API}/course/${query.slug}`)
    return {
        props: {
            course: data
        }
    }
} 

export default SingleCourse;
