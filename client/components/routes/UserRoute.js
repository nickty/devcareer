import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';
import UserNav from '../nav/UserNav'

const UserRoute = ({children}) => {

    const router = useRouter()

    const [ok, setOk] = useState(false)

 

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/current-user')
            console.log(data)
            if(data.ok) setOk(true)
        } catch (error) {
            console.log(error)
            setOk(false)
            router.push('/login')
        }
    }

    
  return <> 
  {!ok ? <SyncOutlined spin className='d-flex justify-content-center display-2 p-5' /> : (
      <div className='container-fluid'>
          <div className='row'>
              <div className='col-md-2'>
                  <UserNav />
              </div>
              <div className='col-md-10'>
              {children}
              </div>
          </div>
      </div>
  )}
  </>;
};

export default UserRoute;
