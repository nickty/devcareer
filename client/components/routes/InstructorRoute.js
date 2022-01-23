import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';
import InstructorNav from '../nav/InstructorNav'

const InstructorRoute = ({children}) => {

    const router = useRouter()

    const [ok, setOk] = useState(false)

 

    useEffect(() => {
        fetchInstructor()
    }, [])

    const fetchInstructor = async () => {
        try {
            const { data } = await axios.get('/api/current-instructor')
            console.log(data)
            if(data.ok) setOk(true)
        } catch (error) {
            console.log(error)
            setOk(false)
            router.push('/')
        }
    }

    
  return <> 
  {!ok ? <SyncOutlined spin className='d-flex justify-content-center display-2 p-5' /> : (
      <div className='container-fluid'>
          <div className='row'>
              <div className='col-md-2'>
                  <InstructorNav />
              </div>
              <div className='col-md-10'>
              {children}
              </div>
          </div>
      </div>
  )}
  </>;
};

export default InstructorRoute;
